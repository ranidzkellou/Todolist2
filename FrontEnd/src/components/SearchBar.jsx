/* eslint-disable react/prop-types */

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  className = "" 
}) => {

  return (
    <div className={`w-full max-w-2xl mb-9 ${className}`}>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9.16683" cy="9.16668" r="5.83333" stroke="#1AA7FF" strokeWidth="1.66667"/>
            <path d="M9.1665 6.66666C8.8382 6.66666 8.51311 6.73132 8.2098 6.85696C7.90648 6.98259 7.63088 7.16674 7.39874 7.39889C7.16659 7.63104 6.98244 7.90663 6.8568 8.20995C6.73117 8.51326 6.6665 8.83835 6.6665 9.16666" stroke="#1AA7FF" strokeWidth="1.66667" strokeLinecap="round"/>
            <path d="M16.6665 16.6667L14.1665 14.1667" stroke="#1AA7FF" strokeWidth="1.66667" strokeLinecap="round"/>
          </svg>


          <span className="text-accent text-sm font-medium">Search</span>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => onSearch(e.target.value)}
            className="
              
              w-full
              text-xs
              px-4
              py-2
              text-[#00426A]
              bg-[#98C0E0]/25
              border
              rounded-lg
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              border-transparent
              focus:ring-[#00426A]
              focus:border-transparent
              placeholder:text-[#00426A]/50
              placeholder:font-light
              placeholder:text-xs
              "
          />
        </div>
      </div>
    </div>
  );
};


export default SearchBar;