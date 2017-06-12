import React from 'react'

import ParserTypes from 'components/page/content/settings/parserTypes/ParserTypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  openParserTypeModal,
  fetchParserTypes,
  removeParserType,

  addParserType,
  updateParserType,
  closeParserTypeModal,

  openParserPatternModal,
  closeParserPatternModal,

  openSimulationModal,
  closeSimulationModal,
  matchFilter,
  parseFilter,

  showFilterEditModal,
  showPatternEditModal,
  updateSimParserType,

  addParserTypeTag,
  removeParserTypeTag,
  showParserTypeTagModal
} from 'actions'

@connect(
  state => ({
    parserTypes: state.settings.parserTypes,
    parserTypeDraw: state.settings.parserTypeDraw,
    parserTypeModalOpen: state.settings.parserTypeModalOpen,

    editParserType: state.settings.editParserType,

    simulationModalOpen: state.settings.simulationModalOpen,

    matchResult: state.settings.matchResult,
    parseResult: state.settings.parseResult,

    filterModalOpen: state.settings.filterModalOpen,
    editFilter: state.settings.editFilter,

    patternModalOpen: state.settings.patternModalOpen,
    editPattern: state.settings.editPattern,

    parserTypeTagModalOpen: state.settings.parserTypeTagModalOpen,
    editParserTypeTags: state.settings.editParserTypeTags
  }),
  dispatch => ({
    ...bindActionCreators({
      openParserTypeModal,
      removeParserType,
      fetchParserTypes,

      addParserType,
      updateParserType,
      closeParserTypeModal,

      openParserPatternModal,
      closeParserPatternModal,

      openSimulationModal,
      closeSimulationModal,
      matchFilter,
      parseFilter,

      showFilterEditModal,
      showPatternEditModal,
      updateSimParserType,

      addParserTypeTag,
      removeParserTypeTag,
      showParserTypeTagModal
    }, dispatch)
  })
)
export default class ParserTypesContainer extends React.Component {
  render () {
    return (
      <ParserTypes {...this.props} />
    )
  }
}
