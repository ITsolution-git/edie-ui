import React from 'react'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import ServerDetailTab from './ServerDetailTab'
import StatusImg from './StatusImg'

import { layoutWidthZoom, layoutHeightZoom } from 'shared/Global'
import GridLayout from './GridLayout'

export default class UserTable extends React.Component {
  getDeviceId () {
    return this.props.match.params.id
  }

  getGauges () {
    return [{
      id: 'basic0',
      name: 'Users',
      templateName: 'Users',
      deviceId: this.getDeviceId(),
      gaugeSize: 'custom',
      layout: {
        i: 'basic0',
        x: 0, y: 0,
        w: 12 * layoutWidthZoom, h: 5 * layoutHeightZoom
      }
    }]
  }
  renderBody () {
    return (
      <GridLayout
        {...this.props}
        gauges={this.getGauges()}
      />
    )
  }
  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title="Users" useToolBar titleOptions={<StatusImg {...this.props} device={device}/>}>
          {/*{this.renderOptions()}*/}
        </TabPageHeader>
        <TabPageBody tabs={ServerDetailTab(device.id, device.templateName)} history={this.props.history} location={this.props.location} transparent>
          {this.renderBody()}
        </TabPageBody>
      </TabPage>
    )
  }
}
