// Simplified Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Search suggestions for country and city search
    const searchInputs = document.querySelectorAll('input[name="search"]');
    
    searchInputs.forEach(input => {
        // Add placeholder suggestions for countries and cities
        const suggestions = [
            'India', 'Mumbai, India', 'Delhi, India', 'Goa, India', 'Kerala, India',
            'USA', 'New York, USA', 'Los Angeles, USA', 'San Francisco, USA',
            'UK', 'London, UK', 'Manchester, UK',
            'France', 'Paris, France', 'Nice, France',
            'Japan', 'Tokyo, Japan', 'Kyoto, Japan',
            'Australia', 'Sydney, Australia', 'Melbourne, Australia'
        ];
        
        // Create suggestion dropdown
        const suggestionBox = document.createElement('div');
        suggestionBox.className = 'suggestion-box';
        suggestionBox.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestionBox);
        
        // Show suggestions on focus
        input.addEventListener('focus', function() {
            showSuggestions();
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!input.parentElement.contains(e.target)) {
                suggestionBox.style.display = 'none';
            }
        });
        
        // Filter suggestions based on input
        input.addEventListener('input', function() {
            showSuggestions();
        });
        
        function showSuggestions() {
            const value = input.value.toLowerCase();
            const filteredSuggestions = suggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(value)
            );
            
            if (filteredSuggestions.length > 0 && value.length > 0) {
                suggestionBox.innerHTML = filteredSuggestions
                    .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
                    .join('');
                
                suggestionBox.style.display = 'block';
                
                // Add click handlers to suggestions
                suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
                    item.style.cssText = `
                        padding: 10px 15px;
                        cursor: pointer;
                        border-bottom: 1px solid #eee;
                    `;
                    
                    item.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = '#f8f9fa';
                    });
                    
                    item.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = 'white';
                    });
                    
                    item.addEventListener('click', function() {
                        input.value = this.textContent;
                        suggestionBox.style.display = 'none';
                    });
                });
            } else {
                suggestionBox.style.display = 'none';
            }
        }
    });
    
    // Quick search functionality
    const searchForm = document.querySelector('form[action="/listing/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="search"]');
            if (searchInput && searchInput.value.trim() === '') {
                e.preventDefault();
                alert('Please enter a country or city to search');
            }
        });
    }
    
    // Add loading state to search buttons
    const searchButtons = document.querySelectorAll('button[type="submit"]');
    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Searching...';
            this.disabled = true;
            
            // Reset after 3 seconds if page doesn't change
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 3000);
        });
    });
    
    // Add search history (localStorage)
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    function addToHistory(searchTerm) {
        if (searchTerm && !searchHistory.includes(searchTerm)) {
            searchHistory.unshift(searchTerm);
            if (searchHistory.length > 10) {
                searchHistory.pop();
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }
    
    // Add search term to history on form submit
    searchInputs.forEach(input => {
        input.closest('form').addEventListener('submit', function() {
            addToHistory(input.value.trim());
        });
    });
}); 