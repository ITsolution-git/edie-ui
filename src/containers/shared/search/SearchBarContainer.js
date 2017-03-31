import React, { Component } from 'react'
import SearchBar from 'components/shared/search/SearchBar'
import SimpleSearchBar from 'components/shared/search/SimpleSearchBar'

export default class SearchBarContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  onFocus () {
    console.log('on focus')
    this.setState({
      active: true
    })
  }

  onBlur () {
    console.log('on blur')
    this.setState({
      active: false
    })
    let input = document.getElementById('searchInput')
    if (!this.props.isSimple) {
      input.value = ''
    }
    input.blur()
  }

  onEnter (e) {
    if (e.charCode === 13) {
      let value = e.currentTarget.value
      console.log('searching for...', value)
      let input = document.getElementById('searchInput')
      input.value = ''
      input.blur()
      this.props.onSearch(value)
    }
  }

  render () {
    console.log('is active? ', this.state.active)
    let autoFocus = this.props.autoFocus
    let isSimple = this.props.isSimple
    return (isSimple
      ? (<SimpleSearchBar
        defaultKeyword={this.props.defaultKeyword}
        onSearch={this.onEnter.bind(this)}
        color={this.state.color}
        active={this.state.active}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        autoFocus={autoFocus}/>)
        : (<SearchBar
          defaultKeyword={this.props.defaultKeyword}
          onSearch={this.onEnter.bind(this)}
          color={this.state.color}
          active={this.state.active}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          autoFocus={autoFocus}/>)
    )
  }
}
