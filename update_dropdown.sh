#!/bin/bash

# List of technical analysis pages to update
PAGES=(
    "btcusd-technical-analysis.html"
    "ethusd-technical-analysis.html"
    "solusd-technical-analysis.html"
    "xrpusd-technical-analysis.html"
    "adausd-technical-analysis.html"
    "xauusd-technical-analysis.html"
    "gbpusd-technical-analysis.html"
    "eurusd-technical-analysis.html"
)

# Updated dropdown menu styles
DROPDOWN_STYLES='
        /* Updated dropdown menu styles */
        .dropdown-menu {
            display: none;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s, transform 0.2s;
        }
        
        .dropdown-trigger:hover + .dropdown-menu,
        .dropdown-menu:hover {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
    </style>'

# Process each page
for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "Updating $page..."
        
        # Add dropdown styles before closing style tag
        sed -i '' -e "/<\/style>/i\\
        $DROPDOWN_STYLES" "$page"
        
        # Update dropdown menu classes
        sed -i '' -e 's/class="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center"/class="dropdown-trigger text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center"/' "$page"
        sed -i '' -e 's/class="absolute left-0 mt-0 w-48"/class="dropdown-menu absolute left-0 mt-0 w-48"/' "$page"
        
        echo "Updated $page successfully"
    else
        echo "Warning: $page not found"
    fi
done

echo "All pages have been updated with the new dropdown menu behavior" 