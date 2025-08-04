# 🚀 Deployment Guide for Real Device Testing

## Option 1: Expo Go (Easiest - No Build Required)

### For Testing on Real Devices:

1. **Start the development server with tunnel:**
   ```bash
   npx expo start --tunnel
   ```

2. **Share with testers:**
   - Install **Expo Go** app on their devices
   - Scan the QR code that appears in the terminal
   - The app will load directly on their device

### Benefits:
- ✅ **No build required**
- ✅ **Instant updates** when you make changes
- ✅ **Works on any device** with Expo Go
- ✅ **Easy to share** with QR codes

### Limitations:
- ❌ **Requires Expo Go app** to be installed
- ❌ **Internet connection** required
- ❌ **Not a standalone app**

---

## Option 2: EAS Build (Standalone App)

### For Creating Installable APK/IPA:

1. **Build for Android (APK):**
   ```bash
   npx eas-cli build --platform android --profile preview
   ```

2. **Build for iOS (IPA):**
   ```bash
   npx eas-cli build --platform ios --profile preview
   ```

3. **Download and install** the generated APK/IPA file

### Benefits:
- ✅ **Standalone app** - no Expo Go required
- ✅ **Works offline** after installation
- ✅ **Can be distributed** via app stores
- ✅ **Native performance**

### Requirements:
- **Apple Developer Account** (for iOS builds)
- **Google Play Console** (for Play Store distribution)

---

## Option 3: Expo Application Services (EAS)

### For Production Deployment:

1. **Set up environment variables:**
   ```bash
   npx eas-cli secret:create --scope project --name GOOGLE_PLACES_API_KEY --value "your_api_key"
   ```

2. **Build for production:**
   ```bash
   npx eas-cli build --platform all --profile production
   ```

3. **Submit to app stores:**
   ```bash
   npx eas-cli submit --platform all
   ```

---

## 🔧 Troubleshooting

### If EAS Build Fails:

1. **Check dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Update Expo SDK:**
   ```bash
   npx expo install --fix
   ```

3. **Clear cache:**
   ```bash
   npx expo start --clear
   ```

### For Apple Developer Issues:

- **Apple ID locked:** Visit https://iforgot.apple.com to reset
- **Missing certificates:** Use Expo's managed credentials
- **Provisioning profiles:** Let EAS handle automatically

---

## 📱 Testing Checklist

### Before Deployment:
- [ ] **API key** is properly configured
- [ ] **All features** work in development
- [ ] **Error handling** is implemented
- [ ] **Loading states** are working
- [ ] **Navigation** flows correctly

### After Deployment:
- [ ] **Test on different devices**
- [ ] **Test with poor network**
- [ ] **Test offline functionality**
- [ ] **Gather user feedback**

---

## 🎯 Recommended Approach

### For Quick Testing:
Use **Option 1 (Expo Go)** - fastest way to test on real devices

### For Beta Testing:
Use **Option 2 (EAS Build)** - creates installable apps

### For Production:
Use **Option 3 (EAS)** - full app store deployment

---

**Need help?** Check the [Expo documentation](https://docs.expo.dev/) or create an issue in this repository. 