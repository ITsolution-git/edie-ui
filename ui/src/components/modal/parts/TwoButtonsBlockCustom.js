import React from 'react'
import {Button} from 'material-ui'
import { buttonStyle, buttonTextStyle } from 'style/common/materialStyles'
const TwoButtonsBlockCustom = ({name1, name2, action1, action2}) => (
  <div className="form-buttons">
    {action1 && <Button variant="raised" label={name1} onClick={action1} style={buttonStyle} labelStyle={buttonTextStyle}/>}
    {action2 && <Button variant="raised" label={name2} onClick={action2} style={buttonStyle} labelStyle={buttonTextStyle}/>}
  </div>
)
export default TwoButtonsBlockCustom
