// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Eğer kullandığınız herhangi bir paket .cjs dosyası sağlıyorsa, 
// bu satırı kullanarak cjs uzantısını da tanıtabilirsiniz:
config.resolver.sourceExts.push('cjs');

// 🔑 Bu satır çok önemli: paket "exports" kısıtlamasını devre dışı bırakıyor,
// expo-router’ın tüm app/ klasörünü tarayıp auth/profile dosyalarınızı
// gerçekten keşfetmesini sağlıyor.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
