# Troubleshooting Guide

## Common Issues and Solutions

### Wallet Connection Issues

#### Problem: Wallet not connecting
**Solutions:**
1. Ensure your wallet extension is installed and enabled
2. Refresh the page
3. Try disconnecting and reconnecting
4. Clear browser cache and cookies
5. Check if wallet is on the correct network

#### Problem: WalletConnect QR not showing or not scanning
**Solutions:**
1. Verify `VITE_WALLETCONNECT_PROJECT_ID` is set correctly
2. Make sure the app origin is allowlisted in WalletConnect Cloud
3. Use your wallet’s built-in scanner (camera apps may not handle `wc:` URIs)
4. Try the “Open on phone” link from the modal

#### Problem: Wrong network
**Solution:**
Switch your wallet to the correct network (mainnet or testnet) that matches the application.

---

### Transaction Issues

#### Problem: Transaction pending for too long
**Solutions:**
1. Check the transaction on the Stacks Explorer
2. Wait for network congestion to clear
3. Stacks transactions can take 10-30 minutes

#### Problem: Transaction failed
**Solutions:**
1. Check if you have enough STX for gas
2. Verify the transaction parameters
3. Check the error message in your wallet
4. Try the transaction again

#### Problem: "Insufficient balance" error
**Solutions:**
1. Verify your wallet balance
2. Account for gas fees
3. Check minimum deposit requirements

---

### Display Issues

#### Problem: Balance not updating
**Solutions:**
1. Refresh the page
2. Wait for transaction confirmation
3. Clear browser cache
4. Check blockchain explorer for accurate data

#### Problem: Vault data not loading
**Solutions:**
1. Check your internet connection
2. Refresh the page
3. Try a different browser
4. Clear browser cache

---

### Contract Interaction Issues

#### Problem: Contract call failed
**Solutions:**
1. Check error code against documentation
2. Verify function parameters
3. Ensure wallet has sufficient STX
4. Check if vault is paused

---

### Browser Compatibility

#### Supported Browsers
- Chrome (recommended)
- Firefox
- Brave
- Edge

#### Known Issues
- Safari may have wallet extension compatibility issues
- Some ad blockers may interfere with wallet connections

---

## Getting Help

If you can't resolve your issue:

1. Check the [FAQ](./FAQ.md)
2. Search existing GitHub issues
3. Open a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Browser and wallet information
   - Any error messages
   - Screenshots if applicable

## Error Code Reference

| Code | Description | Solution |
|------|-------------|----------|
| u1001 | Not authorized | Use the correct account |
| u1002 | Invalid amount | Enter a valid amount |
| u1003 | Insufficient balance | Check your balance |
| u1004 | Vault not found | Verify vault ID |
| u1005 | Vault paused | Wait for vault to resume |
| u1006 | Withdrawal locked | Wait for lock period to end |
| u1007 | Invalid strategy | Select a valid vault |
| u1008 | Self-referral | Use a different referral code |
| u1009 | Already registered | Use existing registration |
