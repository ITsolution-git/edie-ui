import React from 'react'
import SearchIcon from 'material-ui/svg-icons/action/search'

const defaultStyle = {
  backgroundColor: '#d1d1d1'
}

const activeStyle = {
  backgroundColor: '#eaeaea'
}

const iconStyle = {
  lineHeight: 50,
  verticalAlign: 'middle'
}

const SearchBar = ({onSearch, active, onBackgroundChange}) => (
  <div className="searchbar-container"
    onFocus={onBackgroundChange}
    onBlur={onBackgroundChange}>
    <div className="searchbar" style={active ? activeStyle : defaultStyle}>
      <SearchIcon color={active ? '#000000' : '#ffffff'} style={iconStyle}/>
      <input className="searchbar-input" style={active ? activeStyle : defaultStyle}
        onKeyPress={onSearch}/>
    </div>
  </div>
)

export default SearchBar
