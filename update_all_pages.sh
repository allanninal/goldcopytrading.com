#!/bin/bash

# This script updates all cryptocurrency analysis HTML files to remove
# references to trader numbers, reviews, ratings, testimonials, and promotions

echo "Updating all cryptocurrency analysis pages..."

# Array of files to update
FILES=(
  "adausd-technical-analysis.html"
  "xrpusd-technical-analysis.html"
  "solusd-technical-analysis.html"
  "xauusd-technical-analysis.html"
  "gbpusd-technical-analysis.html"
  "btcusd-technical-analysis.html"
  "ethusd-technical-analysis.html"
  "eurusd-technical-analysis.html"
  "index.html"
)

for file in "${FILES[@]}"; do
  echo "Processing $file..."
  
  # Remove ROI statistics
  sed -i '' 's/average of <span class="font-bold text-blue-[0-9]\{3\}">[0-9]\{1,2\}\.[0-9]% ROI<\/span> last month/professional trading tools/g' "$file"
  sed -i '' 's/average of <span class="font-bold text-purple-[0-9]\{3\}">[0-9]\{1,2\}\.[0-9]% ROI<\/span> last month/Access professional trading tools/g' "$file"
  sed -i '' 's/average of [0-9]\{1,2\}\.[0-9]% ROI last month/professional trading tools/g' "$file"
  sed -i '' 's/Traders made an average of <span class="font-bold text-[a-z]\{3,6\}-[0-9]\{3\}">[0-9]\{1,2\}\.[0-9]% ROI<\/span> last month/Access professional trading tools/g' "$file"
  sed -i '' 's/Traders made an average of [0-9]\{1,2\}\.[0-9]% ROI last month/Access professional trading tools/g' "$file"
  sed -i '' 's/Our traders made an average of [0-9]\{1,2\}\.[0-9]% ROI last month/Access professional trading tools/g' "$file"
  
  # Remove star rating sections - from star rating div to end div
  perl -i -0pe 's/<!-- Star Rating -->\s*<div class="flex justify-center items-center mb-6">.*?<\/div>\s*<\/div>//gs' "$file"
  perl -i -0pe 's/<div class="flex justify-center mb-4">.*?<\/div>\s*<\/div>//gs' "$file"
  
  # Remove testimonial sections - handle multiple formats
  perl -i -0pe 's/<div class="w-full bg-white p-4 rounded-lg shadow-sm mb-6">.*?<\/div>\s*<\/div>//gs' "$file"
  
  # Handle the specific ADA testimonial format
  perl -i -0pe 's/<!-- Testimonial -->\s*<div class="bg-white\/10 p-4 rounded-lg mb-8 max-w-lg mx-auto">.*?<\/p>\s*<\/div>//gs' "$file"
  
  # Remove "Join 250,000+ traders" and similar references
  sed -i '' 's/Join 250,000+ traders today/Start with just \$10/g' "$file"
  sed -i '' 's/Join 250,000+ traders who trust our analysis/Access professional trading tools/g' "$file"
  sed -i '' 's/Join thousands of successful traders with just \$10 minimum deposit/Start trading with just \$10 minimum deposit/g' "$file"
  sed -i '' 's/Join thousands of successful Ethereum traders on LiteFinance/Access professional trading tools on LiteFinance/g' "$file"
  sed -i '' 's/Join 8,500+ copy traders • Multi-asset platform/Multi-asset trading platform/g' "$file"
  sed -i '' 's/Join [0-9,]\{1,\}+ copy traders/Multi-asset platform/g' "$file"
  sed -i '' 's/Join [0-9,]\{1,\}+ traders today/Start with just \$10/g' "$file"
  
  # Remove trader count and success rate from copy trading option
  sed -i '' 's/Copy Pro [A-Z]\{2,4\} Traders ([0-9]\{1,2\}% success rate)/Copy Professional Traders/g' "$file"
  sed -i '' 's/✅ Copy Pro [A-Z]\{2,4\} Traders ([0-9]\{1,2\}% success rate)/✅ Copy Professional Traders/g' "$file"
  sed -i '' 's/✅ Follow top ETH traders/✅ Follow professional traders/g' "$file"
  
  # Remove success rate references in buttons
  sed -i '' 's/<span class="text-xs block">[0-9]\{1,2\}% success rate<\/span>/<span class="text-xs block">Professional trading<\/span>/g' "$file"
  sed -i '' 's/<p class="text-xs font-normal mt-1">[0-9]\{1,2\}% success rate<\/p>/<p class="text-xs font-normal mt-1">Copy expert traders automatically<\/p>/g' "$file"
  sed -i '' 's/<span class="text-xs text-gray-400">[0-9]\{1,2\}% success rate<\/span>/<span class="text-xs text-gray-400">Copy expert traders automatically<\/span>/g' "$file"
  
  # Remove "32 traders joined in the last hour" references
  sed -i '' 's/<p class="ml-3 text-sm text-blue-100">32 traders joined in the last hour<\/p>//g' "$file"
  sed -i '' 's/<p class="ml-3 text-sm text-yellow-100">32 traders joined in the last hour<\/p>//g' "$file"
  
  # Remove trust indicators with ratings
  perl -i -0pe 's/<div class="flex justify-center items-center space-x-4 mb-4">.*?<\/div>\s*<\/div>//gs' "$file"
  perl -i -0pe 's/<div class="flex flex-wrap justify-center items-center gap-4 mb-4">.*?<\/div>\s*<\/div>//gs' "$file"
  
  # Replace with simpler trust indicators
  perl -i -0pe 's/<p class="text-sm mb-2">Start with just \$10 • No commission fees • 24\/7 multilingual support<\/p>\s*<p class="text-xs text-blue-200">Offer expires in 24 hours<\/p>/<div class="text-xs text-center text-gray-500 max-w-sm mx-auto mb-6">\n                        <p>Regulated broker • Fast withdrawals • Secure platform<\/p>\n                    <\/div>/gs' "$file"
  
  perl -i -0pe 's/<p class="text-sm text-gray-600">Start with just \$10 • No commission fees • 24\/7 multilingual support<\/p>\s*<p class="text-xs text-red-600 mt-2 font-medium">Offer expires in 24 hours<\/p>/<div class="text-xs text-center text-gray-500 max-w-sm mx-auto">\n                        <p>Regulated broker • Fast withdrawals • Secure platform<\/p>\n                    <\/div>/gs' "$file"
  
  # Update CTA buttons to remove success rates
  sed -i '' 's/82% success rate/Copy expert traders automatically/g' "$file"
  sed -i '' 's/Trusted by traders in over 150 countries • Regulated platform • 24\/7 multilingual support/Regulated platform • 24\/7 multilingual support/g' "$file"
  sed -i '' 's/<p class="text-xs text-gray-400 mt-2">Trusted by traders in over 150 countries<\/p>/<p class="text-xs text-gray-400 mt-2">Regulated platform • Secure trading<\/p>/g' "$file"
  
  # Remove analysis accuracy claims
  sed -i '' 's/ADA\/USD has shown 19% volatility in the past month. Our previous analysis achieved 84% accuracy./Get professional ADA\/USD analysis and trading tools./g' "$file"
  sed -i '' 's/[A-Z]\{2,4\}\/USD has shown [0-9]\{1,2\}% volatility in the past month. Our previous analysis achieved [0-9]\{1,2\}% accuracy./Get professional analysis and trading tools./g' "$file"
  
  # Remove specific number claims
  sed -i '' 's/Our analysis has predicted [0-9]\{1,2\} out of the last [0-9]\{1,2\} major [A-Z]\{2,4\}\/USD moves/Get access to professional market analysis/g' "$file"
  
  # Remove specific rating references
  sed -i '' 's/<span class="ml-2 text-gray-600 font-medium">4.9\/5 from over [0-9,]\{1,\}+ traders<\/span>/<span class="ml-2 text-gray-600 font-medium">Professional trading platform<\/span>/g' "$file"
  
  # NEW: Remove promotional language, special offers, limited time offers
  # Remove "Limited Time Offer" badges
  sed -i '' 's/<div class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4">Limited Time Offer<\/div>//g' "$file"
  sed -i '' 's/<div class="inline-block bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">Limited Time Offer<\/div>//g' "$file"
  
  # Remove "FEATURED OPPORTUNITY" badges
  sed -i '' 's/<span class="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">FEATURED OPPORTUNITY<\/span>//g' "$file"
  
  # Remove "offer expires" text
  sed -i '' 's/<p class="text-xs text-blue-200">Offer expires in 24 hours<\/p>//g' "$file"
  sed -i '' 's/<p class="text-xs text-red-600 mt-2 font-medium">Offer expires in 24 hours<\/p>//g' "$file"
  
  # Remove special offer sections
  sed -i '' 's/<p class="text-yellow-800 font-medium">Special offer: Get 50% off your first month<\/p>//g' "$file"
  sed -i '' 's/<p class="text-xs text-yellow-700">Limited time - offer ends in <span class="font-bold">24 hours<\/span><\/p>//g' "$file"
  sed -i '' 's/<p class="text-xs text-yellow-700 mt-1">Limited time offer<\/p>//g' "$file"
  
  # Remove pulse effect from buttons (indicates urgency)
  sed -i '' 's/class="cta-button pulse-effect /class="cta-button /g' "$file"
  
  # Replace promotional titles with neutral ones
  sed -i '' 's/Ready to Trade \([A-Z]\{2,4\}\)?\?/Trading \1/g' "$file"
  sed -i '' 's/\([A-Z]\{2,4\}\)\/USD.s Next Major Move Could Be Coming!/Trade \1\/USD with Confidence/g' "$file"
  sed -i '' 's/\([A-Z]\{2,4\}\).s Next Major Move Could Be Coming!/Trade \1 with Confidence/g' "$file"
  sed -i '' 's/Trade \([A-Z]\{2,4\}\) with Confidence!/Trade \1/g' "$file"
  sed -i '' 's/Start Trading \([A-Z]\{2,4\}\) Today!/Trade \1/g' "$file"
  sed -i '' 's/\([A-Z]\{2,4\}\) Trading Made Simple!/Trade \1/g' "$file"
  
  # Remove emojis from button text
  sed -i '' 's/🚀 Create Free Account/Create Free Account/g' "$file"
  sed -i '' 's/👥 Copy Pro \([A-Z]\{2,4\}\) Traders/Copy Professional Traders/g' "$file"
  
  echo "Completed updating $file"
done

echo "All files updated successfully!" 