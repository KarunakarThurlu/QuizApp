//create ToolTip component using react with mui
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}))(Tooltip);
const ToolTipUtil = (props) => {
    return (
        <LightTooltip  aria-label="Add" title={props.toolTipData} arrow>
           <span className="table-cell-trucate">{props.toolTipData && props.toolTipData.substr(0, props.length)} {props.toolTipData && props.toolTipData.length>props.length-1?"...":""}</span>
        </LightTooltip>
    );
}
 
export default ToolTipUtil;
