import React from 'react'
import { reduxForm, submit, formValueSelector } from 'redux-form'
import { connect, keys } from 'react-redux'
import { merge, assign, concat, isArray } from 'lodash'
import moment from 'moment'
import {Popover, FlatButton, Chip} from 'material-ui'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import {ResponsiveInfiniteTable} from '../../../shared/InfiniteTable'
import SearchTabs from './SearchTabs'
import TabPage from '../../../shared/TabPage'
import TabPageBody from '../../../shared/TabPageBody'
import TabPageHeader from '../../../shared/TabPageHeader'
import { imageBaseUrl, parseSearchQuery, guid } from 'shared/Global'

import SearchFormView from './SearchFormView'
import SearchSavePopover from './SearchSavePopover'

const styles = {
  chip: {
    margin: 4
  },
  chipLabel: {
    fontSize: '12px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '300px',
    overflow: 'auto'
  }
}

class GenericSearch extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    this.dateOptions = [{
      name: 'Last 24 hours',
      from: moment().add(-24, 'hours').valueOf(),
      to: moment().valueOf()
    }, {
      name: 'Any time',
      from: 0,
      to: 0
    }]

    this.cells = [{
      'displayName': 'Type',
      'columnName': 'type',
      'cssClassName': 'width-80'
    }, {
      'displayName': 'Content',
      'columnName': 'entity.id',
      'customComponent': (props) => {
        const {rowData} = props
        if (!rowData.entity) return <span/>

        // let data = JSON.stringify(assign({}, rowData.entity, rowData.highlights))
        const data = this.getHighlighted(rowData.entity, rowData.highlights)
        // if (data.length > 500) data = `${data.substring(0, 500)}...`
        return <span dangerouslySetInnerHTML={{ __html: data }} /> // eslint-disable-line
      }
    }]

    if (props.userInfo) this.props.fetchSearchOptions(props.userInfo.id)
    this.props.fetchSearchFields(props.params)
    this.props.fetchWorkflows()
  }

  getHighlighted (entity, highlights) {
    let data = merge({}, entity)
    keys(highlights).forEach(path => {
      const highlighted = highlights[path]
      const pathElements = path.split(".")

      let el = data
      pathElements.forEach((pathEl, index) => {
        if (index === pathElements.length - 1) {
          el[pathEl] = highlighted
        } else {
          el = el[pathEl]
          if (isArray(el)) el = el[0]
        }
      })
    })

    //return JSON.stringify(assign({}, rowData.entity, rowData.highlights))
  }

  onSearchKeyDown (e) {
    if (e.keyCode === 13) {
      submit('genericSearchForm')
    }
  }

  onRowDblClick () {

  }

  handleFormSubmit (values) {
    const { queryChips } = this.props
    const { query } = values

    const newChips = parseSearchQuery(query)
    const newQueryChips = concat([], queryChips, newChips)

    this.props.updateQueryChips(newQueryChips)

    this.props.updateSearchParams({
      query: newQueryChips.map(m => `${m.name}=${m.value}`).join(' and '),
      dateIndex: values.dateIndex,
      dateFrom: this.dateOptions[values.dateIndex].from,
      dateTo: this.dateOptions[values.dateIndex].to,
      workflow: ''
    })

    this.props.change('query', '')
  }

  getTypeChar (type) {
    switch (type) {
      case 'long':
      case 'boolean':
      case 'int':
        return '#'
    }
    return 'a'
  }

  handleRequestClose () {
    this.props.closeFieldsPopover()
  }

  onClickField (field, e) {
    this.props.fetchFieldTopValues(field.path, this.props.params)
    this.props.openFieldsPopover(field, e.target)
  }

  onClickValue (value) {
    const { selectedField, params, queryChips } = this.props

    if (!selectedField) return
    this.props.closeFieldsPopover()
    this.props.change('query', '')

    const newQueryChips = concat([], queryChips, {name: selectedField.path, value})
    this.props.updateQueryChips(newQueryChips)
    this.props.updateSearchParams(assign({}, params, {
      query: newQueryChips.map(m => `${m.name}=${m.value}`).join(' and ')
    }))
  }

  onClickRemoveChip (index) {
    const newQueryChips = this.props.queryChips.filter((p, i) => i !== index)
    this.props.updateQueryChips(newQueryChips)
    this.props.updateSearchParams(assign({}, this.props.params, {
      query: newQueryChips.map(m => `${m.name}=${m.value}`).join(' and ')
    }))
  }

  onClickStar (e) {
    const { userInfo, envVars, selectedSearchOption, searchOptions, change, removeSearchOption, openSearchSavePopover } = this.props

    if (selectedSearchOption) {
      change('searchOptionIndex', '')
      const found = searchOptions.filter(i => i.id === selectedSearchOption)
      if (userInfo && found.length) removeSearchOption(envVars, userInfo.id, found[0])
    } else {
      openSearchSavePopover(null, e.target)
    }
  }

  onClickSaveSearch (values) {
    const { userInfo, envVars } = this.props
    const { dateIndex, query } = this.props.params
    if (!userInfo.id) return
    const option = {
      id: guid(),
      name: values.name,
      data: {
        dateIndex,
        query
      }
    }

    this.props.closeSearchSavePopover()
    this.props.addSearchOption(envVars, userInfo.id, option)
  }

  onChangeSearchOption (m, value) {
    const found = this.props.searchOptions.filter(i => i.id === value)
    if (!found.length) {
      found.push({data: {query: '', dateIndex: 0}})
    }

    const { query, dateIndex } = found[0].data

    const newQueryChips = parseSearchQuery(query)
    this.props.updateQueryChips(newQueryChips)
    this.props.updateSearchParams({
      query,
      dateIndex,
      dateFrom: this.dateOptions[dateIndex].from,
      dateTo: this.dateOptions[dateIndex].to
    })

    this.props.change('query', '')
    this.props.change('dateIndex', dateIndex)
  }

  onChangeWorkflow () {
  }

  renderFields () {
    const {selectedField} = this.props
    return (
      <div className="padding-sm" style={{position: 'absolute', height: '100%'}}>
        <h5>Fields</h5>
        {this.props.fields.map(f =>
          <div key={f.path} className={`field-item margin-xs-top ${selectedField && selectedField.path === f.path ? 'selected' : ''}`}>
            <span className="margin-sm-right text-gray">{this.getTypeChar(f.type)}</span>
            <a href="javascript:;" onClick={this.onClickField.bind(this, f)}>{f.path}</a>
            <span className="margin-sm-left text-gray">{f.count}</span>
          </div>
        )}
      </div>
    )
  }

  renderSavePopover () {
    const { savePopoverOpen, anchorEl, closeSearchSavePopover } = this.props
    if (!savePopoverOpen) return
    return (
      <SearchSavePopover
        anchorEl={anchorEl}
        onRequestClose={closeSearchSavePopover}
        onSubmit={this.onClickSaveSearch.bind(this)}
      />
    )
  }

  renderFieldPopover () {
    const { selectedField, fieldPopoverOpen, anchorEl } = this.props
    if (!selectedField) return
    return (
      <Popover
        open={fieldPopoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'center'}}
        targetOrigin={{horizontal: 'left', vertical: 'center'}}
        style={{marginLeft: '100px'}}
        onRequestClose={this.handleRequestClose.bind(this)}
      >
        <div className="padding-md-left">
          <div className="inline padding-sm">
            <h4>{selectedField.path}</h4>
          </div>
          <div className="pull-right padding-sm">
            <FlatButton icon={<NavigationClose />} style={{minWidth: '44px'}} onTouchTap={this.handleRequestClose.bind(this)}/>
          </div>
        </div>

        <hr className="m-none" style={{borderColor: 'gray'}}/>

        <div className="padding-md-left padding-md-top">
          <div className="inline padding-sm">
            {selectedField.count} Values
          </div>
        </div>

        <div className="padding-md-left padding-lg-top">
          <div className="padding-sm">
            <b>Reports</b>
          </div>
          <div className="padding-sm">
            <div>
              <div className="col-md-4"><a href="javascript:;">Top values</a></div>
              <div className="col-md-4"><a href="javascript:;">Top values by time</a></div>
              <div className="col-md-4"><a href="javascript:;">Rare values</a></div>
              <div className="col-md-4"><a href="javascript:;">Events with this field</a></div>
            </div>

          </div>
        </div>

        <div style={{height: '400px', width: '100%', overflowY: 'auto', overflowX: 'hidden'}}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th><b>Top 10 Values</b></th>
                <th>Count</th>
                <th>%</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
            {
              this.props.fieldTopValues.map(m =>
                <tr key={m.name}>
                  <td>
                    <a href="javascript:;" onClick={this.onClickValue.bind(this, m.name)}>{m.name}</a>
                  </td>
                  <td>{m.count}</td>
                  <td>{(m.percent || 0).toFixed(2)}%</td>
                  <td>
                    <div style={{width: '200px'}}>
                      <img src={`${imageBaseUrl}bar.png`} width={`${Math.max(m.percent || 0, 0.5)}%`} height="16"/>
                    </div>
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </Popover>
    )
  }

  render () {
    const { handleSubmit } = this.props
    return (
      <TabPage>
        <TabPageHeader title="Search">
          <SearchFormView
            onSearchKeyDown={this.onSearchKeyDown.bind(this)}
            dateOptions={this.dateOptions}
            searchOptions={this.props.searchOptions.map(m => ({label: m.name, value: m.id}))}
            onClickStar={this.onClickStar.bind(this)}
            starFilled={!!this.props.selectedSearchOption}
            workflows={this.props.workflows}
            onChangeWorkflow={this.onChangeWorkflow.bind(this)}
            onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
            onChangeSearchOption={this.onChangeSearchOption.bind(this)}
          />

          <div className="text-center">
            <div className="inline">
              <div style={styles.wrapper}>
                {this.props.queryChips.map((p, i) =>
                  <Chip key={`${p.name}${p.value}`} style={styles.chip} onRequestDelete={this.onClickRemoveChip.bind(this, i)}>
                    <b>{p.name}</b>: {p.value}
                  </Chip>
                )}
              </div>
            </div>

            {this.renderSavePopover()}
          </div>

        </TabPageHeader>

        <TabPageBody tabs={SearchTabs} tab={0}>
          <div className="flex-horizontal" style={{height: '100%'}}>
            <div style={{minWidth: '300px', height: '100%', overflow: 'auto', position: 'relative'}}>
              {this.renderFields()}
              {this.renderFieldPopover()}
            </div>
            <div className="flex-1 flex-vertical">
              <ResponsiveInfiniteTable
                url="/search/all"
                cells={this.cells}
                rowHeight={200}
                ref="table"
                rowMetadata={{'key': 'id'}}
                selectable
                onRowDblClick={this.onRowDblClick.bind(this)}
                params={this.props.params}
              />
            </div>
          </div>

        </TabPageBody>
      </TabPage>
    )
  }
}

const GenericSearchForm = reduxForm({form: 'genericSearchForm'})(GenericSearch)
const selector = formValueSelector('genericSearchForm')

export default connect(
  state => ({
    initialValues: assign({}, state.search.params, {query: ''}),
    selectedSearchOption: selector(state, 'searchOptionIndex')
  })
)(GenericSearchForm)
