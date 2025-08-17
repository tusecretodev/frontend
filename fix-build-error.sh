#!/bin/bash

# Script para solucionar el error de TypeScript ':hover' en Linux
echo "🔧 Solucionando error de build en Linux..."

# 1. Limpiar caché de Next.js
echo "📁 Limpiando caché de Next.js..."
rm -rf .next
rm -rf node_modules/.cache

# 2. Limpiar node_modules y reinstalar
echo "📦 Reinstalando dependencias..."
rm -rf node_modules
rm -f package-lock.json
npm install

# 3. Verificar versiones
echo "📋 Verificando versiones:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "TypeScript: $(npx tsc --version)"

# 4. Limpiar caché de TypeScript
echo "🧹 Limpiando caché de TypeScript..."
npx tsc --build --clean

# 5. Intentar build
echo "🚀 Intentando build..."
npm run build

echo "✅ Script completado. Si el error persiste, revisa las versiones de dependencias."