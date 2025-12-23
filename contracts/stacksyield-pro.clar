;; StacksYield Pro - Yield Aggregator & Auto-Compounding Vault System
;; A DeFi protocol for maximizing STX yields with multiple vault strategies

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u1001))
(define-constant ERR-INVALID-AMOUNT (err u1002))
(define-constant ERR-INSUFFICIENT-BALANCE (err u1003))
(define-constant ERR-VAULT-NOT-FOUND (err u1004))
(define-constant ERR-VAULT-PAUSED (err u1005))
(define-constant ERR-WITHDRAWAL-LOCKED (err u1006))
(define-constant ERR-INVALID-STRATEGY (err u1007))
(define-constant ERR-REFERRAL-SELF (err u1008))
(define-constant ERR-ALREADY-REGISTERED (err u1009))

;; Fee constants (in basis points, 100 = 1%)
(define-constant DEPOSIT-FEE u50)        ;; 0.5% deposit fee
(define-constant WITHDRAWAL-FEE u50)     ;; 0.5% withdrawal fee
(define-constant PERFORMANCE-FEE u1000)  ;; 10% performance fee on yields
(define-constant EMERGENCY-FEE u500)     ;; 5% emergency withdrawal fee
(define-constant REFERRAL-BONUS u25)     ;; 0.25% referral bonus

;; Strategy types
(define-constant STRATEGY-CONSERVATIVE u1)
(define-constant STRATEGY-BALANCED u2)
(define-constant STRATEGY-AGGRESSIVE u3)

;; Data Variables
(define-data-var total-tvl uint u0)
(define-data-var total-users uint u0)
(define-data-var total-fees-collected uint u0)
(define-data-var protocol-paused bool false)
(define-data-var next-vault-id uint u1)
(define-data-var treasury principal CONTRACT-OWNER)

;; Data Maps
(define-map vaults
  { vault-id: uint }
  {
    name: (string-ascii 50),
    strategy: uint,
    total-deposits: uint,
    total-shares: uint,
    apy: uint,
    min-deposit: uint,
    lock-period: uint,
    is-active: bool,
    created-at: uint
  }
)

(define-map user-deposits
  { user: principal, vault-id: uint }
  {
    shares: uint,
    deposit-amount: uint,
    deposit-time: uint,
    last-compound: uint,
    pending-rewards: uint
  }
)

(define-map user-stats
  { user: principal }
  {
    total-deposited: uint,
    total-withdrawn: uint,
    total-rewards: uint,
    referral-earnings: uint,
    referrer: (optional principal),
    referral-count: uint,
    is-registered: bool
  }
)

(define-map referral-codes
  { code: (string-ascii 20) }
  { owner: principal }
)

(define-map user-referral-code
  { user: principal }
  { code: (string-ascii 20) }
)

;; Read-only functions
(define-read-only (get-vault (vault-id uint))
  (map-get? vaults { vault-id: vault-id })
)

(define-read-only (get-user-deposit (user principal) (vault-id uint))
  (map-get? user-deposits { user: user, vault-id: vault-id })
)

(define-read-only (get-user-stats (user principal))
  (default-to
    {
      total-deposited: u0,
      total-withdrawn: u0,
      total-rewards: u0,
      referral-earnings: u0,
      referrer: none,
      referral-count: u0,
      is-registered: false
    }
    (map-get? user-stats { user: user })
  )
)

(define-read-only (get-total-tvl)
  (var-get total-tvl)
)

(define-read-only (get-total-users)
  (var-get total-users)
)

(define-read-only (get-total-fees)
  (var-get total-fees-collected)
)

(define-read-only (calculate-shares (amount uint) (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) u0))
    (total-shares (get total-shares vault))
    (total-deposits (get total-deposits vault))
  )
    (if (is-eq total-shares u0)
      amount
      (/ (* amount total-shares) total-deposits)
    )
  )
)

(define-read-only (calculate-withdrawal-amount (shares uint) (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) u0))
    (total-shares (get total-shares vault))
    (total-deposits (get total-deposits vault))
  )
    (if (is-eq total-shares u0)
      u0
      (/ (* shares total-deposits) total-shares)
    )
  )
)

(define-read-only (get-referral-code-owner (code (string-ascii 20)))
  (map-get? referral-codes { code: code })
)

(define-read-only (get-user-referral-code (user principal))
  (map-get? user-referral-code { user: user })
)

(define-read-only (calculate-pending-rewards (user principal) (vault-id uint))
  (let (
    (user-deposit (unwrap! (get-user-deposit user vault-id) u0))
    (vault (unwrap! (get-vault vault-id) u0))
    (time-elapsed (- block-height (get last-compound user-deposit)))
    (apy (get apy vault))
    (shares (get shares user-deposit))
  )
    ;; Simplified reward calculation
    (/ (* (* shares apy) time-elapsed) (* u10000 u52560))
  )
)

;; Public functions

;; Register user with optional referral
(define-public (register-user (referral-code (optional (string-ascii 20))))
  (let (
    (user-data (get-user-stats tx-sender))
  )
    (asserts! (not (get is-registered user-data)) ERR-ALREADY-REGISTERED)
    
    (let (
      (referrer-principal (match referral-code
        code (match (get-referral-code-owner code)
          ref-data (some (get owner ref-data))
          none
        )
        none
      ))
    )
      (asserts! (not (is-eq referrer-principal (some tx-sender))) ERR-REFERRAL-SELF)
      
      (map-set user-stats
        { user: tx-sender }
        {
          total-deposited: u0,
          total-withdrawn: u0,
          total-rewards: u0,
          referral-earnings: u0,
          referrer: referrer-principal,
          referral-count: u0,
          is-registered: true
        }
      )
      
      ;; Update referrer's count
      (match referrer-principal
        ref (let (
          (ref-stats (get-user-stats ref))
        )
          (map-set user-stats
            { user: ref }
            (merge ref-stats { referral-count: (+ (get referral-count ref-stats) u1) })
          )
        )
        true
      )
      
      (var-set total-users (+ (var-get total-users) u1))
      (ok true)
    )
  )
)

;; Create referral code
(define-public (create-referral-code (code (string-ascii 20)))
  (let (
    (user-data (get-user-stats tx-sender))
  )
    (asserts! (get is-registered user-data) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (get-referral-code-owner code)) ERR-ALREADY-REGISTERED)
    
    (map-set referral-codes { code: code } { owner: tx-sender })
    (map-set user-referral-code { user: tx-sender } { code: code })
    (ok true)
  )
)

;; Deposit into vault
(define-public (deposit (vault-id uint) (amount uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-data (get-user-stats tx-sender))
    (existing-deposit (default-to
      { shares: u0, deposit-amount: u0, deposit-time: u0, last-compound: u0, pending-rewards: u0 }
      (get-user-deposit tx-sender vault-id)
    ))
  )
    (asserts! (not (var-get protocol-paused)) ERR-VAULT-PAUSED)
    (asserts! (get is-active vault) ERR-VAULT-PAUSED)
    (asserts! (>= amount (get min-deposit vault)) ERR-INVALID-AMOUNT)
    
    (let (
      (fee (/ (* amount DEPOSIT-FEE) u10000))
      (net-amount (- amount fee))
      (shares (calculate-shares net-amount vault-id))
      (referral-bonus-amount (/ (* fee REFERRAL-BONUS) u100))
    )
      ;; Transfer STX to contract
      (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
      
      ;; Pay referral bonus if applicable
      (match (get referrer user-data)
        ref (begin
          (try! (as-contract (stx-transfer? referral-bonus-amount tx-sender ref)))
          (let (
            (ref-stats (get-user-stats ref))
          )
            (map-set user-stats
              { user: ref }
              (merge ref-stats { referral-earnings: (+ (get referral-earnings ref-stats) referral-bonus-amount) })
            )
          )
        )
        true
      )
      
      ;; Update vault
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (+ (get total-deposits vault) net-amount),
          total-shares: (+ (get total-shares vault) shares)
        })
      )
      
      ;; Update user deposit
      (map-set user-deposits
        { user: tx-sender, vault-id: vault-id }
        {
          shares: (+ (get shares existing-deposit) shares),
          deposit-amount: (+ (get deposit-amount existing-deposit) net-amount),
          deposit-time: (if (is-eq (get deposit-time existing-deposit) u0) block-height (get deposit-time existing-deposit)),
          last-compound: block-height,
          pending-rewards: (get pending-rewards existing-deposit)
        }
      )
      
      ;; Update user stats
      (map-set user-stats
        { user: tx-sender }
        (merge user-data { total-deposited: (+ (get total-deposited user-data) net-amount) })
      )
      
      ;; Update protocol stats
      (var-set total-tvl (+ (var-get total-tvl) net-amount))
      (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
      
      (ok { shares: shares, net-amount: net-amount, fee: fee })
    )
  )
)

;; Withdraw from vault
(define-public (withdraw (vault-id uint) (shares uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-INSUFFICIENT-BALANCE))
    (user-data (get-user-stats tx-sender))
  )
    (asserts! (not (var-get protocol-paused)) ERR-VAULT-PAUSED)
    (asserts! (>= (get shares user-deposit) shares) ERR-INSUFFICIENT-BALANCE)
    
    ;; Check lock period
    (let (
      (lock-end (+ (get deposit-time user-deposit) (get lock-period vault)))
    )
      (asserts! (>= block-height lock-end) ERR-WITHDRAWAL-LOCKED)
      
      (let (
        (withdrawal-amount (calculate-withdrawal-amount shares vault-id))
        (fee (/ (* withdrawal-amount WITHDRAWAL-FEE) u10000))
        (net-amount (- withdrawal-amount fee))
        (pending (calculate-pending-rewards tx-sender vault-id))
      )
        ;; Transfer STX to user
        (try! (as-contract (stx-transfer? (+ net-amount pending) tx-sender tx-sender)))
        
        ;; Update vault
        (map-set vaults
          { vault-id: vault-id }
          (merge vault {
            total-deposits: (- (get total-deposits vault) withdrawal-amount),
            total-shares: (- (get total-shares vault) shares)
          })
        )
        
        ;; Update user deposit
        (map-set user-deposits
          { user: tx-sender, vault-id: vault-id }
          (merge user-deposit {
            shares: (- (get shares user-deposit) shares),
            deposit-amount: (- (get deposit-amount user-deposit) withdrawal-amount),
            last-compound: block-height,
            pending-rewards: u0
          })
        )
        
        ;; Update user stats
        (map-set user-stats
          { user: tx-sender }
          (merge user-data {
            total-withdrawn: (+ (get total-withdrawn user-data) net-amount),
            total-rewards: (+ (get total-rewards user-data) pending)
          })
        )
        
        ;; Update protocol stats
        (var-set total-tvl (- (var-get total-tvl) withdrawal-amount))
        (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
        
        (ok { amount: net-amount, rewards: pending, fee: fee })
      )
    )
  )
)

;; Emergency withdraw (with penalty)
(define-public (emergency-withdraw (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-INSUFFICIENT-BALANCE))
    (user-data (get-user-stats tx-sender))
    (shares (get shares user-deposit))
  )
    (asserts! (> shares u0) ERR-INSUFFICIENT-BALANCE)
    
    (let (
      (withdrawal-amount (calculate-withdrawal-amount shares vault-id))
      (fee (/ (* withdrawal-amount EMERGENCY-FEE) u10000))
      (net-amount (- withdrawal-amount fee))
    )
      ;; Transfer STX to user (no rewards on emergency)
      (try! (as-contract (stx-transfer? net-amount tx-sender tx-sender)))
      
      ;; Update vault
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (- (get total-deposits vault) withdrawal-amount),
          total-shares: (- (get total-shares vault) shares)
        })
      )
      
      ;; Clear user deposit
      (map-delete user-deposits { user: tx-sender, vault-id: vault-id })
      
      ;; Update user stats
      (map-set user-stats
        { user: tx-sender }
        (merge user-data { total-withdrawn: (+ (get total-withdrawn user-data) net-amount) })
      )
      
      ;; Update protocol stats
      (var-set total-tvl (- (var-get total-tvl) withdrawal-amount))
      (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
      
      (ok { amount: net-amount, penalty: fee })
    )
  )
)

;; Compound rewards
(define-public (compound (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-INSUFFICIENT-BALANCE))
    (pending (calculate-pending-rewards tx-sender vault-id))
  )
    (asserts! (> pending u0) ERR-INVALID-AMOUNT)
    
    (let (
      (performance-fee (/ (* pending PERFORMANCE-FEE) u10000))
      (net-rewards (- pending performance-fee))
      (new-shares (calculate-shares net-rewards vault-id))
    )
      ;; Update vault
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (+ (get total-deposits vault) net-rewards),
          total-shares: (+ (get total-shares vault) new-shares)
        })
      )
      
      ;; Update user deposit
      (map-set user-deposits
        { user: tx-sender, vault-id: vault-id }
        (merge user-deposit {
          shares: (+ (get shares user-deposit) new-shares),
          deposit-amount: (+ (get deposit-amount user-deposit) net-rewards),
          last-compound: block-height,
          pending-rewards: u0
        })
      )
      
      ;; Update protocol stats
      (var-set total-tvl (+ (var-get total-tvl) net-rewards))
      (var-set total-fees-collected (+ (var-get total-fees-collected) performance-fee))
      
      (ok { compounded: net-rewards, new-shares: new-shares, fee: performance-fee })
    )
  )
)

;; Admin functions

;; Create new vault
(define-public (create-vault 
  (name (string-ascii 50)) 
  (strategy uint) 
  (apy uint) 
  (min-deposit uint) 
  (lock-period uint)
)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (or (is-eq strategy STRATEGY-CONSERVATIVE) 
                  (or (is-eq strategy STRATEGY-BALANCED) 
                      (is-eq strategy STRATEGY-AGGRESSIVE))) ERR-INVALID-STRATEGY)
    
    (let (
      (vault-id (var-get next-vault-id))
    )
      (map-set vaults
        { vault-id: vault-id }
        {
          name: name,
          strategy: strategy,
          total-deposits: u0,
          total-shares: u0,
          apy: apy,
          min-deposit: min-deposit,
          lock-period: lock-period,
          is-active: true,
          created-at: block-height
        }
      )
      
      (var-set next-vault-id (+ vault-id u1))
      (ok vault-id)
    )
  )
)

;; Update vault APY
(define-public (update-vault-apy (vault-id uint) (new-apy uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { apy: new-apy })
    )
    (ok true)
  )
)

;; Pause/Unpause vault
(define-public (toggle-vault (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { is-active: (not (get is-active vault)) })
    )
    (ok true)
  )
)

;; Pause entire protocol
(define-public (toggle-protocol)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set protocol-paused (not (var-get protocol-paused)))
    (ok true)
  )
)

;; Update treasury
(define-public (set-treasury (new-treasury principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set treasury new-treasury)
    (ok true)
  )
)

;; Withdraw collected fees to treasury
(define-public (withdraw-fees)
  (let (
    (fees (var-get total-fees-collected))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> fees u0) ERR-INVALID-AMOUNT)
    
    (try! (as-contract (stx-transfer? fees tx-sender (var-get treasury))))
    (var-set total-fees-collected u0)
    (ok fees)
  )
)

;; Initialize default vaults
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    
    ;; Conservative Vault - 5% APY, 1 STX min, 1 week lock
    (try! (create-vault "Conservative Vault" STRATEGY-CONSERVATIVE u500 u1000000 u1008))
    
    ;; Balanced Vault - 12% APY, 10 STX min, 2 week lock  
    (try! (create-vault "Balanced Vault" STRATEGY-BALANCED u1200 u10000000 u2016))
    
    ;; Aggressive Vault - 25% APY, 50 STX min, 4 week lock
    (try! (create-vault "Aggressive Vault" STRATEGY-AGGRESSIVE u2500 u50000000 u4032))
    
    (ok true)
  )
)
