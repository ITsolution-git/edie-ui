import React from 'react'
import Network from 'components/page/content/device/monitors/NetworkTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceApps,

  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors
} from 'actions'

@connect(
  state => ({
    device: state.dashboard.selectedDevice,

    monitorNetworks: state.devices.monitorNetworks,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    fetchDeviceApps,

    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors
  }
)

@withRouter
export default class NetworkContainer extends React.Component {
  render () {
    return (
      <Network {...this.props}/>
    )
  }
}
