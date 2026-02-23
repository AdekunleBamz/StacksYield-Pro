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

;; Admin Timelock Enhancement
(define-data-var admin-timelock uint u0)        ;; block height when timelock was set
(define-data-var pending-action (optional (tuple (action-name (string-ascii 50)) (params (string-ascii 100))))) ;; pending admin action
(define-constant TIMELOCK-DURATION u10)        ;; 10 blocks for demo (adjust as needed)

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

;; -------------------------
;; Read-only functions
;; -------------------------
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

;; -------------------------
;; Public functions
;; -------------------------

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
  ;; Implementation remains same as previous
)

;; Emergency withdraw, compound, admin functions
;; Implementation remains same as previous
;; Except admin actions will be executed via timelock mechanism

;; -------------------------
;; Admin Timelock Functions
;; -------------------------

;; Schedule an admin action
(define-public (schedule-admin-action (action-name (string-ascii 50)) (params (string-ascii 100)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set admin-timelock block-height)
    (var-set pending-action (some { action-name: action-name, params: params }))
    (ok true)
  )
)

;; Execute the scheduled admin action after timelock
(define-public (execute-admin-action)
  (let (
        (timelock-start (var-get admin-timelock))
        (pending (unwrap-panic (var-get pending-action)))
        (blocks-elapsed (- block-height timelock-start))
       )
    (asserts! (>= blocks-elapsed TIMELOCK-DURATION) (err u2000)) ;; timelock not reached
    ;; Dispatch action based on name
    (match (get action-name pending)
      "update-vault-apy" 
        (begin
          ;; params expected as "vaultId:newAPY", e.g. "1:1200"
          (let ((parts (split (get params pending) ":")))
            (update-vault-apy (to-uint (nth 0 parts)) (to-uint (nth 1 parts)))
          )
          )
          (var-set pending-action none)
          (ok true)
        )
      "toggle-vault"
        (begin
          (let ((vault-id (to-uint (get params pending))))
            (toggle-vault vault-id)
          )
          (var-set pending-action none)
          (ok true)
        )
      "withdraw-fees"
        (begin
          (withdraw-fees)
          (var-set pending-action none)
          (ok true)
        )
      _ (err u2001) ;; unknown action
    )
  )
)
