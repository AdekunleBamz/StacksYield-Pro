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
(define-constant ERR-INVALID-SHARES (err u1010))
(define-constant ERR-NOT-REGISTERED (err u1011))
(define-constant ERR-NO-PENDING-ACTION (err u1012))
(define-constant ERR-TIMELOCK-NOT-READY (err u1013))
(define-constant ERR-NO-SHARES (err u1014))
(define-constant ERR-LOCK-PERIOD-ACTIVE (err u1015))
(define-constant ERR-ACTION-ALREADY-PENDING (err u1016))
(define-constant ERR-INVALID-APY (err u1017))
(define-constant ERR-NO-REWARDS (err u1018))

;; Fee constants (in basis points, 100 = 1%)
(define-constant DEPOSIT-FEE u50)        ;; 0.5% deposit fee
(define-constant WITHDRAWAL-FEE u50)     ;; 0.5% withdrawal fee
(define-constant PERFORMANCE-FEE u1000)  ;; 10% performance fee on yields
(define-constant EMERGENCY-FEE u500)     ;; 5% emergency withdrawal fee
(define-constant REFERRAL-BONUS u25)     ;; 0.25% referral bonus
(define-constant BPS-DENOMINATOR u10000)
(define-constant BLOCKS-PER-YEAR u52560)
(define-constant MAX-APY u10000)

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
(define-data-var pending-action (optional (tuple (action-name (string-ascii 50)) (params (string-ascii 100)))) none) ;; pending admin action
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

(define-read-only (get-user-referrer (user principal))
  (get referrer (get-user-stats user))
)

(define-read-only (has-user-referrer (user principal))
  (is-some (get referrer (get-user-stats user)))
)

(define-read-only (get-user-referral-count (user principal))
  (get referral-count (get-user-stats user))
)

(define-read-only (get-user-referral-earnings (user principal))
  (get referral-earnings (get-user-stats user))
)

(define-read-only (get-user-total-deposited (user principal))
  (get total-deposited (get-user-stats user))
)

(define-read-only (get-user-total-withdrawn (user principal))
  (get total-withdrawn (get-user-stats user))
)

(define-read-only (get-user-total-rewards (user principal))
  (get total-rewards (get-user-stats user))
)

(define-read-only (is-user-registered (user principal))
  (get is-registered (get-user-stats user))
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

(define-read-only (get-contract-owner)
  CONTRACT-OWNER
)

(define-read-only (get-deposit-fee-bps)
  DEPOSIT-FEE
)

(define-read-only (get-withdrawal-fee-bps)
  WITHDRAWAL-FEE
)

(define-read-only (get-performance-fee-bps)
  PERFORMANCE-FEE
)

(define-read-only (get-emergency-fee-bps)
  EMERGENCY-FEE
)

(define-read-only (get-referral-bonus-bps)
  REFERRAL-BONUS
)

(define-read-only (get-bps-denominator)
  BPS-DENOMINATOR
)

(define-read-only (get-blocks-per-year)
  BLOCKS-PER-YEAR
)

(define-read-only (get-max-apy)
  MAX-APY
)

(define-read-only (get-timelock-duration)
  TIMELOCK-DURATION
)

(define-read-only (get-protocol-paused)
  (var-get protocol-paused)
)

(define-read-only (get-treasury)
  (var-get treasury)
)

(define-read-only (get-next-vault-id)
  (var-get next-vault-id)
)

(define-read-only (get-admin-timelock)
  (var-get admin-timelock)
)

(define-read-only (get-pending-admin-action)
  (var-get pending-action)
)

(define-read-only (get-blocks-until-admin-action)
  (let (
    (timelock-start (var-get admin-timelock))
    (elapsed (- block-height timelock-start))
  )
    (if (>= elapsed TIMELOCK-DURATION)
      u0
      (- TIMELOCK-DURATION elapsed)
    )
  )
)

(define-read-only (has-pending-admin-action)
  (is-some (var-get pending-action))
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

(define-read-only (calculate-deposit-fee (amount uint))
  (/ (* amount DEPOSIT-FEE) BPS-DENOMINATOR)
)

(define-read-only (calculate-withdrawal-fee (amount uint))
  (/ (* amount WITHDRAWAL-FEE) BPS-DENOMINATOR)
)

(define-read-only (calculate-emergency-fee (amount uint))
  (/ (* amount EMERGENCY-FEE) BPS-DENOMINATOR)
)

(define-read-only (calculate-referral-bonus (fee uint))
  (/ (* fee REFERRAL-BONUS) u100)
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

(define-read-only (get-vault-apy (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get apy data)
      u0
    )
  )
)

(define-read-only (get-vault-name (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get name data)
      ""
    )
  )
)

(define-read-only (get-vault-strategy (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get strategy data)
      u0
    )
  )
)

(define-read-only (get-vault-created-at (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get created-at data)
      u0
    )
  )
)

(define-read-only (get-vault-min-deposit (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get min-deposit data)
      u0
    )
  )
)

(define-read-only (get-vault-lock-period (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get lock-period data)
      u0
    )
  )
)

(define-read-only (is-vault-active (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get is-active data)
      false
    )
  )
)

(define-read-only (get-vault-total-shares (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get total-shares data)
      u0
    )
  )
)

(define-read-only (get-vault-total-deposits (vault-id uint))
  (let ((vault (get-vault vault-id)))
    (match vault
      data (get total-deposits data)
      u0
    )
  )
)

(define-read-only (get-referral-code-owner (code (string-ascii 20)))
  (map-get? referral-codes { code: code })
)

(define-read-only (get-user-referral-code (user principal))
  (map-get? user-referral-code { user: user })
)

(define-read-only (has-user-referral-code (user principal))
  (is-some (get-user-referral-code user))
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
    (/ (* (* shares apy) time-elapsed) (* BPS-DENOMINATOR BLOCKS-PER-YEAR))
  )
)

(define-read-only (get-user-shares (user principal) (vault-id uint))
  (let ((user-deposit (get-user-deposit user vault-id)))
    (match user-deposit
      position (get shares position)
      u0
    )
  )
)

(define-read-only (get-user-deposit-amount (user principal) (vault-id uint))
  (let ((user-deposit (get-user-deposit user vault-id)))
    (match user-deposit
      position (get deposit-amount position)
      u0
    )
  )
)

(define-read-only (get-user-last-compound (user principal) (vault-id uint))
  (let ((user-deposit (get-user-deposit user vault-id)))
    (match user-deposit
      position (get last-compound position)
      u0
    )
  )
)

(define-read-only (get-user-deposit-time (user principal) (vault-id uint))
  (let ((user-deposit (get-user-deposit user vault-id)))
    (match user-deposit
      position (get deposit-time position)
      u0
    )
  )
)

(define-read-only (get-user-cached-pending-rewards (user principal) (vault-id uint))
  (let ((user-deposit (get-user-deposit user vault-id)))
    (match user-deposit
      position (get pending-rewards position)
      u0
    )
  )
)

(define-read-only (has-user-position (user principal) (vault-id uint))
  (is-some (get-user-deposit user vault-id))
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
      (fee (calculate-deposit-fee amount))
      (net-amount (- amount fee))
      (shares (calculate-shares net-amount vault-id))
      (referral-bonus-amount (calculate-referral-bonus fee))
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
    (user-data (get-user-stats tx-sender))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-NO-SHARES))
  )
    (asserts! (not (var-get protocol-paused)) ERR-VAULT-PAUSED)
    (asserts! (get is-active vault) ERR-VAULT-PAUSED)
    (asserts! (> shares u0) ERR-INVALID-SHARES)
    (asserts! (get is-registered user-data) ERR-NOT-REGISTERED)
    (asserts! (>= (get shares user-deposit) shares) ERR-INVALID-SHARES)
    (asserts! (>= block-height (+ (get deposit-time user-deposit) (get lock-period vault))) ERR-LOCK-PERIOD-ACTIVE)
    (let (
      (gross-amount (calculate-withdrawal-amount shares vault-id))
      (fee (calculate-withdrawal-fee gross-amount))
      (net-amount (- gross-amount fee))
    )
      (asserts! (> gross-amount u0) ERR-INVALID-AMOUNT)
      (asserts! (> net-amount u0) ERR-INVALID-AMOUNT)
      (asserts! (>= (get total-deposits vault) gross-amount) ERR-INSUFFICIENT-BALANCE)
      (asserts! (>= (get total-shares vault) shares) ERR-INVALID-SHARES)
      (asserts! (>= (get deposit-amount user-deposit) gross-amount) ERR-INVALID-AMOUNT)
      (asserts! (>= (var-get total-tvl) gross-amount) ERR-INSUFFICIENT-BALANCE)
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (- (get total-deposits vault) gross-amount),
          total-shares: (- (get total-shares vault) shares)
        })
      )
      (map-set user-deposits
        { user: tx-sender, vault-id: vault-id }
        (merge user-deposit {
          shares: (- (get shares user-deposit) shares),
          deposit-amount: (- (get deposit-amount user-deposit) gross-amount),
          last-compound: block-height
        })
      )
      (map-set user-stats
        { user: tx-sender }
        (merge user-data {
          total-withdrawn: (+ (get total-withdrawn user-data) net-amount)
        })
      )
      (var-set total-tvl (- (var-get total-tvl) gross-amount))
      (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
      (try! (as-contract (stx-transfer? net-amount tx-sender contract-caller)))
      (ok { withdrawn-shares: shares, gross-amount: gross-amount, fee: fee, net-amount: net-amount })
    )
  )
)

(define-public (compound (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-data (get-user-stats tx-sender))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-NO-SHARES))
  )
    (asserts! (not (var-get protocol-paused)) ERR-VAULT-PAUSED)
    (asserts! (get is-active vault) ERR-VAULT-PAUSED)
    (asserts! (get is-registered user-data) ERR-NOT-REGISTERED)
    (let (
      (rewards (calculate-pending-rewards tx-sender vault-id))
      (reward-shares (calculate-shares rewards vault-id))
    )
      (asserts! (> rewards u0) ERR-NO-REWARDS)
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (+ (get total-deposits vault) rewards),
          total-shares: (+ (get total-shares vault) reward-shares)
        })
      )
      (map-set user-deposits
        { user: tx-sender, vault-id: vault-id }
        (merge user-deposit {
          shares: (+ (get shares user-deposit) reward-shares),
          deposit-amount: (+ (get deposit-amount user-deposit) rewards),
          last-compound: block-height,
          pending-rewards: u0
        })
      )
      (map-set user-stats
        { user: tx-sender }
        (merge user-data { total-rewards: (+ (get total-rewards user-data) rewards) })
      )
      (var-set total-tvl (+ (var-get total-tvl) rewards))
      (ok { rewards: rewards, reward-shares: reward-shares })
    )
  )
)

(define-public (emergency-withdraw (vault-id uint))
  (let (
    (vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND))
    (user-data (get-user-stats tx-sender))
    (user-deposit (unwrap! (get-user-deposit tx-sender vault-id) ERR-NO-SHARES))
  )
    (asserts! (get is-registered user-data) ERR-NOT-REGISTERED)
    (asserts! (var-get protocol-paused) ERR-VAULT-PAUSED)
    (let (
      (shares (get shares user-deposit))
      (gross-amount (calculate-withdrawal-amount (get shares user-deposit) vault-id))
      (fee (calculate-emergency-fee gross-amount))
      (net-amount (- gross-amount fee))
    )
      (asserts! (> shares u0) ERR-NO-SHARES)
      (asserts! (> gross-amount u0) ERR-INVALID-AMOUNT)
      (asserts! (> net-amount u0) ERR-INVALID-AMOUNT)
      (asserts! (>= (get total-deposits vault) gross-amount) ERR-INSUFFICIENT-BALANCE)
      (asserts! (>= (get total-shares vault) shares) ERR-INVALID-SHARES)
      (asserts! (>= (var-get total-tvl) gross-amount) ERR-INSUFFICIENT-BALANCE)
      (map-set vaults
        { vault-id: vault-id }
        (merge vault {
          total-deposits: (- (get total-deposits vault) gross-amount),
          total-shares: (- (get total-shares vault) shares)
        })
      )
      (map-delete user-deposits { user: tx-sender, vault-id: vault-id })
      (map-set user-stats
        { user: tx-sender }
        (merge user-data {
          total-withdrawn: (+ (get total-withdrawn user-data) net-amount)
        })
      )
      (var-set total-tvl (- (var-get total-tvl) gross-amount))
      (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
      (try! (as-contract (stx-transfer? net-amount tx-sender contract-caller)))
      (ok { gross-amount: gross-amount, fee: fee, net-amount: net-amount })
    )
  )
)

(define-public (set-protocol-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set protocol-paused paused)
    (ok paused)
  )
)

(define-public (set-treasury (new-treasury principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set treasury new-treasury)
    (ok new-treasury)
  )
)

(define-public (create-vault (name (string-ascii 50)) (strategy uint) (apy uint) (min-deposit uint) (lock-period uint))
  (let ((vault-id (var-get next-vault-id)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (or (is-eq strategy STRATEGY-CONSERVATIVE) (is-eq strategy STRATEGY-BALANCED) (is-eq strategy STRATEGY-AGGRESSIVE)) ERR-INVALID-STRATEGY)
    (asserts! (> min-deposit u0) ERR-INVALID-AMOUNT)
    (asserts! (> apy u0) ERR-INVALID-APY)
    (asserts! (<= apy MAX-APY) ERR-INVALID-APY)
    (asserts! (> lock-period u0) ERR-INVALID-AMOUNT)
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

(define-public (set-vault-apy (vault-id uint) (new-apy uint))
  (let ((vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> new-apy u0) ERR-INVALID-APY)
    (asserts! (<= new-apy MAX-APY) ERR-INVALID-APY)
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { apy: new-apy })
    )
    (ok new-apy)
  )
)

(define-public (set-vault-active (vault-id uint) (is-active bool))
  (let ((vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { is-active: is-active })
    )
    (ok is-active)
  )
)

(define-public (set-vault-min-deposit (vault-id uint) (new-min-deposit uint))
  (let ((vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> new-min-deposit u0) ERR-INVALID-AMOUNT)
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { min-deposit: new-min-deposit })
    )
    (ok new-min-deposit)
  )
)

(define-public (set-vault-lock-period (vault-id uint) (new-lock-period uint))
  (let ((vault (unwrap! (get-vault vault-id) ERR-VAULT-NOT-FOUND)))
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (> new-lock-period u0) ERR-INVALID-AMOUNT)
    (map-set vaults
      { vault-id: vault-id }
      (merge vault { lock-period: new-lock-period })
    )
    (ok new-lock-period)
  )
)

;; -------------------------
;; Admin Timelock Functions
;; -------------------------

;; Schedule an admin action
(define-public (schedule-admin-action (action-name (string-ascii 50)) (params (string-ascii 100)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (var-get pending-action)) ERR-ACTION-ALREADY-PENDING)
    (var-set admin-timelock block-height)
    (var-set pending-action (some { action-name: action-name, params: params }))
    (ok true)
  )
)

;; Execute the scheduled admin action after timelock
(define-public (execute-admin-action)
  (let (
        (timelock-start (var-get admin-timelock))
        (blocks-elapsed (- block-height timelock-start))
       )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (>= blocks-elapsed TIMELOCK-DURATION) ERR-TIMELOCK-NOT-READY) ;; timelock not reached
    (match (var-get pending-action)
      pending
        (begin
          (var-set admin-timelock u0)
          (var-set pending-action none)
          (ok (get action-name pending))
        )
      ERR-NO-PENDING-ACTION ;; no action scheduled
    )
  )
)
