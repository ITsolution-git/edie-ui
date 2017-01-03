import React from 'react'
import { Router, browserHistory, Route } from 'react-router'

import MainContainer from './containers/page/MainContainer'
import SigninContainer from './containers/auth/SigninContainer'
import SignupContainer from './containers/auth/SignupContainer'
import SignoutContainer from './containers/auth/SignoutContainer'

import Search from './components/page/content/search/Search'
import SearchIncidentsContainer from './containers/page/content/search/IncidentsContainer'
import SearchDevices from './components/page/content/search/Devices'
import SearchProcess from './components/page/content/search/Processes'
import Chat from './components/page/content/chat/Chat'
import Incidents from './components/page/content/incidents/Incidents'
import BigIncidentsContainer from './containers/page/content/dashboard/incidents/BigIncidentsContainer'
import ThreatMap from './components/page/content/threatmap/Threatmap'
import Settings from './components/page/content/settings/Settings'
import SettingGeneral from './components/page/content/settings/general/General'
import SettingAgent from './components/page/content/settings/agent/Agents'
import SettingRules from './components/page/content/settings/rule/Rules'
import SettingMaps from './components/page/content/settings/maps/Maps'
import SettingUsers from './components/page/content/settings/users/Users'
import SettingIdentity from './components/page/content/settings/identity/Identities'
import SettingCredentials from './components/page/content/settings/credentials/Credentials'
import SettingTemplates from './components/page/content/settings/template/Templates'
import SettingAdvanced from './components/page/content/settings/advanced/Advanced'

import DeviceContainer from './containers/page/content/device/DeviceContainer'
import DeviceMain from './components/page/content/device/main/Main'
import DeviceMainIncidentsContainer from './containers/page/content/device/main/incidents/MainIncidentsContainer'
import DeviceMainRulesContainer from './containers/page/content/device/main/rules/MainRulesContainer'
import DeviceMainRawIncidentsContainer from './containers/page/content/device/main/raw-incidents/MainRawIncidentsContainer'
import DeviceMainAdvancedContainer from './containers/page/content/device/main/advanced/MainAdvancedContainer'
import DeviceMainRuleAddContainer from './containers/page/content/device/main/rules/MainRulesAddContainer'
import DeviceMonitorsContainer from './containers/page/content/device/monitors/MonitorsContainer'
import DeviceConnectedContainer from './containers/page/content/device/connected/ConnectedContainer'
import DeviceInfo from './components/page/content/device/info/Info'

import DeviceListContainer from './containers/DeviceListContainer'

import RequireAuth from './components/auth/RequireAuth'

const onMainEnter = (prevState, nextState, replace, callback) => {
  console.log('On Main Change')
  setTimeout(() => {
    window.dispatchEvent(new window.Event('resize'))
  }, 150)
  callback && callback()
}

export default(
  <Router history={browserHistory}>
    <Route path="/" component={RequireAuth(MainContainer)} onChange={onMainEnter}>
      <Route path="chat" component={Chat} />
      <Route path="search" component={Search}>
        <Route path="incidents" component={SearchIncidentsContainer} />
        <Route path="devices" component={SearchDevices} />
        <Route path="process" component={SearchProcess} />
      </Route>
      <Route path="incidents" component={Incidents}/>
      <Route path="bigincidents" component={BigIncidentsContainer}/>
      <Route path="threatmap" component={ThreatMap}/>
      <Route path="settings" component={Settings}>
        <Route path="general" component={SettingGeneral} />
        <Route path="agents" component={SettingAgent} />
        <Route path="rules" component={SettingRules} />
        <Route path="maps" component={SettingMaps} />
        <Route path="users" component={SettingUsers} />
        <Route path="identities" component={SettingIdentity} />
        <Route path="credentials" component={SettingCredentials} />
        <Route path="templates" component={SettingTemplates} />
        <Route path="advanced" component={SettingAdvanced} />
      </Route>

      <Route path="device" component={DeviceContainer}>
        <Route path="main" component={DeviceMain}>
          <Route path="incidents" component={DeviceMainIncidentsContainer}/>
          <Route path="rules" component={DeviceMainRulesContainer}/>
          <Route path="rawIncidents" component={DeviceMainRawIncidentsContainer}/>
          <Route path="advanced" component={DeviceMainAdvancedContainer}/>
          <Route path="ruleAdd" component={DeviceMainRuleAddContainer}/>
        </Route>
        <Route path="monitor" component={DeviceMonitorsContainer}/>
        <Route path="connected" component={DeviceConnectedContainer}/>
        <Route path="info" component={DeviceInfo}/>
      </Route>

    </Route>
    <Route path="/signin" component={SigninContainer} />
    <Route path="/signout" component={SignoutContainer} />
    <Route path="/signup" component={SignupContainer} />
    <Route path="/devicelist" component={DeviceListContainer} />
  </Router>
)

