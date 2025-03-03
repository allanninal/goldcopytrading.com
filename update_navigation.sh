#!/bin/bash

# Script to update navigation menu across all technical analysis pages
# This ensures a consistent navigation structure across the website

echo "Updating navigation menus for all technical analysis pages..."

# List of all technical analysis pages
PAGES=(
  "ethusd-technical-analysis.html"
  "xrpusd-technical-analysis.html"
  "solusd-technical-analysis.html"
  "adausd-technical-analysis.html"
  "xauusd-technical-analysis.html"
  "gbpusd-technical-analysis.html" 
  "eurusd-technical-analysis.html"
)

# Function to update a single page
update_page() {
  local page=$1
  local page_title=$(echo $page | cut -d'-' -f1 | tr '[:lower:]' '[:upper:]')
  
  echo "Processing $page..."
  
  # Create temporary file
  temp_file="${page}.temp"
  
  # Copy the file to a temp file
  cp "$page" "$temp_file"
  
  # Process the file - replace navigation block
  awk -v page="$page" -v title="$page_title" '
  BEGIN { found = 0; skip = 0; }
  
  # Look for navigation start
  /<!-- Navigation Menu -->/ { 
    found = 1; 
    print $0;
    
    # Insert new navigation content
    print "    <nav class=\"bg-white shadow-lg fixed w-full z-50\">";
    print "        <div class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">";
    print "            <div class=\"flex justify-between h-16\">";
    print "                <!-- Logo -->";
    print "                <div class=\"flex items-center\">";
    print "                    <a href=\"index.html\" class=\"flex items-center space-x-2\">";
    print "                        <span class=\"text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent\">GoldCopyTrading</span>";
    print "                    </a>";
    print "                </div>";
    print "";
    print "                <!-- Desktop Menu -->";
    print "                <div class=\"hidden lg:flex items-center space-x-8\">";
    print "                    <!-- Main Navigation -->";
    print "                    <div class=\"flex space-x-6\">";
    print "                        <a href=\"index.html#how-it-works\" class=\"text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium\">How It Works</a>";
    print "                        <a href=\"index.html#our-approach\" class=\"text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium\">Our Approach</a>";
    print "                        <a href=\"index.html#benefits\" class=\"text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium\">Benefits</a>";
    print "                    </div>";
    print "";
    print "                    <!-- Analysis Links -->";
    print "                    <div class=\"flex space-x-6 border-l pl-6\">";
    print "                        <div class=\"group relative\">";
    print "                            <button class=\"text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center\">";
    print "                                Market Analysis";
    print "                                <svg class=\"w-4 h-4 ml-1\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">";
    print "                                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" />";
    print "                                </svg>";
    print "                            </button>";
    print "                            <!-- Added negative top margin and padding-top to create hoverable area -->";
    print "                            <div class=\"absolute left-0 mt-0 w-48\">";
    print "                                <!-- Added invisible bridge with padding -->";
    print "                                <div class=\"invisible h-2\"></div>";
    print "                                <!-- Actual dropdown content -->";
    print "                                <div class=\"bg-white rounded-lg shadow-lg py-2\">";
    
    # Set active page in dropdown
    if (page == "btcusd-technical-analysis.html") {
      print "                                    <a href=\"btcusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">BTC/USD Analysis</a>";
    } else {
      print "                                    <a href=\"btcusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">BTC/USD Analysis</a>";
    }
    
    if (page == "ethusd-technical-analysis.html") {
      print "                                    <a href=\"ethusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">ETH/USD Analysis</a>";
    } else {
      print "                                    <a href=\"ethusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">ETH/USD Analysis</a>";
    }
    
    if (page == "solusd-technical-analysis.html") {
      print "                                    <a href=\"solusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">SOL/USD Analysis</a>";
    } else {
      print "                                    <a href=\"solusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">SOL/USD Analysis</a>";
    }
    
    if (page == "xrpusd-technical-analysis.html") {
      print "                                    <a href=\"xrpusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">XRP/USD Analysis</a>";
    } else {
      print "                                    <a href=\"xrpusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">XRP/USD Analysis</a>";
    }
    
    if (page == "adausd-technical-analysis.html") {
      print "                                    <a href=\"adausd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">ADA/USD Analysis</a>";
    } else {
      print "                                    <a href=\"adausd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">ADA/USD Analysis</a>";
    }
    
    if (page == "xauusd-technical-analysis.html") {
      print "                                    <a href=\"xauusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">XAU/USD Analysis</a>";
    } else {
      print "                                    <a href=\"xauusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">XAU/USD Analysis</a>";
    }
    
    if (page == "gbpusd-technical-analysis.html") {
      print "                                    <a href=\"gbpusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">GBP/USD Analysis</a>";
    } else {
      print "                                    <a href=\"gbpusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">GBP/USD Analysis</a>";
    }
    
    if (page == "eurusd-technical-analysis.html") {
      print "                                    <a href=\"eurusd-technical-analysis.html\" class=\"block px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50\">EUR/USD Analysis</a>";
    } else {
      print "                                    <a href=\"eurusd-technical-analysis.html\" class=\"block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600\">EUR/USD Analysis</a>";
    }
    
    print "                                </div>";
    print "                            </div>";
    print "                        </div>";
    print "                    </div>";
    print "";
    print "                    <!-- CTA Button -->";
    print "                    <a href=\"https://bit.ly/litefinance-register-now\" target=\"_blank\" ";
    print "                       class=\"bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-md hover:shadow-lg\">";
    print "                        Start Trading";
    print "                    </a>";
    print "                </div>";
    print "";
    print "                <!-- Mobile menu button -->";
    print "                <div class=\"lg:hidden flex items-center\">";
    print "                    <button onclick=\"toggleMobileMenu()\" class=\"text-gray-600 hover:text-blue-600 transition-colors duration-200\">";
    print "                        <svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">";
    print "                            <path id=\"menuIcon\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 6h16M4 12h16m-16 6h16\" class=\"block\"></path>";
    print "                            <path id=\"closeIcon\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\" class=\"hidden\"></path>";
    print "                        </svg>";
    print "                    </button>";
    print "                </div>";
    print "            </div>";
    print "        </div>";
    print "";
    print "        <!-- Mobile menu -->";
    print "        <div id=\"mobileMenu\" class=\"hidden lg:hidden bg-white border-t border-gray-100\">";
    print "            <div class=\"px-4 py-3 space-y-3\">";
    print "                <a href=\"index.html#how-it-works\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200\">How It Works</a>";
    print "                <a href=\"index.html#our-approach\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200\">Our Approach</a>";
    print "                <a href=\"index.html#benefits\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200\">Benefits</a>";
    print "                ";
    print "                <div class=\"pt-2 border-t border-gray-100\">";
    print "                    <p class=\"px-3 py-2 text-sm font-medium text-gray-500\">Analysis</p>";
    
    # Set active page in mobile menu
    if (page == "btcusd-technical-analysis.html") {
      print "                    <a href=\"btcusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">BTC/USD Analysis</a>";
    } else {
      print "                    <a href=\"btcusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">BTC/USD Analysis</a>";
    }
    
    if (page == "ethusd-technical-analysis.html") {
      print "                    <a href=\"ethusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">ETH/USD Analysis</a>";
    } else {
      print "                    <a href=\"ethusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">ETH/USD Analysis</a>";
    }
    
    if (page == "solusd-technical-analysis.html") {
      print "                    <a href=\"solusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">SOL/USD Analysis</a>";
    } else {
      print "                    <a href=\"solusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">SOL/USD Analysis</a>";
    }
    
    if (page == "xrpusd-technical-analysis.html") {
      print "                    <a href=\"xrpusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">XRP/USD Analysis</a>";
    } else {
      print "                    <a href=\"xrpusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">XRP/USD Analysis</a>";
    }
    
    if (page == "adausd-technical-analysis.html") {
      print "                    <a href=\"adausd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">ADA/USD Analysis</a>";
    } else {
      print "                    <a href=\"adausd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">ADA/USD Analysis</a>";
    }
    
    if (page == "xauusd-technical-analysis.html") {
      print "                    <a href=\"xauusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">XAU/USD Analysis</a>";
    } else {
      print "                    <a href=\"xauusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">XAU/USD Analysis</a>";
    }
    
    if (page == "gbpusd-technical-analysis.html") {
      print "                    <a href=\"gbpusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">GBP/USD Analysis</a>";
    } else {
      print "                    <a href=\"gbpusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">GBP/USD Analysis</a>";
    }
    
    if (page == "eurusd-technical-analysis.html") {
      print "                    <a href=\"eurusd-technical-analysis.html\" class=\"block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg\">EUR/USD Analysis</a>";
    } else {
      print "                    <a href=\"eurusd-technical-analysis.html\" class=\"block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg\">EUR/USD Analysis</a>";
    }
    
    print "                </div>";
    print "                ";
    print "                <div class=\"pt-3\">";
    print "                    <a href=\"https://bit.ly/litefinance-register-now\" target=\"_blank\" ";
    print "                       class=\"block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md\">";
    print "                        Start Trading";
    print "                    </a>";
    print "                </div>";
    print "            </div>";
    print "        </div>";
    print "    </nav>";
    
    # Start skipping the old navigation section
    skip = 1;
    next;
  }
  
  # Look for main content start to stop skipping
  /<!-- Main Content -->/ { 
    if (found) skip = 0; 
  }
  
  # Print non-skipped lines
  { if (!skip) print $0; }
  ' "$temp_file" > "$page"
  
  # Remove the temporary file
  rm "$temp_file"
  
  echo "Updated $page successfully"
}

# Update each page
for page in "${PAGES[@]}"
do
  update_page "$page"
done

# Also update the BTC/USD page since we're starting from it
update_page "btcusd-technical-analysis.html"

echo "Navigation menu updated for all technical analysis pages!"
echo "All pages now have a consistent navigation structure." 