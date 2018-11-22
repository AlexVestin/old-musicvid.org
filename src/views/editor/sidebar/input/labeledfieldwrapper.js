
import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import Help from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip';
import classes from './labeledfieldwrapper.css'
import { withStyles } from '@material-ui/core/styles';

import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

const iconStyle = {
    width: 18,
    height: 18,
    marginTop: 2
}


const Title = (props) => {
    const autoIconWidth = 18

    const showTooltip = (props.min !== undefined || props.max !== undefined || props.tooltip !== undefined);
    const toolTip = showTooltip ? 
        (
            <div>
                {props.tooltip ? props.tooltip  : ""}
                {props.tooltip && <br/>}
                {props.min !== undefined && 
                    <React.Fragment>{"  min: " + props.min}</React.Fragment>
                }
                {props.max !== undefined && 
                    <React.Fragment>{"  max: " + props.max}</React.Fragment>
                }
            </div>
        ) 
    :
        "" 

    return (
        <div style={{display: "flex", flexDirection: "row"}}>  
            <Tooltip 
                id="tooltip-top-start" 
                title={toolTip} 
                placement="bottom">
                
                <div style={{width: autoIconWidth, height: autoIconWidth}}>
                    <Help 
                        className={classes.helpIcon} 
                        style={{...iconStyle, color: showTooltip ? "black" : "gray"}}>
                    </Help>                  
                </div>
            </Tooltip>
            <div style={{ marginTop: 4, marginLeft: 5, fontSize: 14 }}>{props.keyVal}</div>  
        </div>
    )
}

const AutomationIcon = (props) => {
    const autoIconWidth = 18
    const iconMarginTop = 2

    return(
        <Tooltip id="tooltip-top-start" title={"Add keyframe track (disabled)"} placement="right-end">
            <div style={{width: autoIconWidth, height: autoIconWidth}}>
                <BrightnessAuto 
                    disabled
                    style={{ marginTop: iconMarginTop,  width: autoIconWidth, height: autoIconWidth, color:"gray"}}
                ></BrightnessAuto>
            </div>
        </Tooltip>
    )
}


const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    scrollContainer: {
      height: 400,
      overflow: 'auto',
      marginBottom: theme.spacing.unit * 3,
    },
    scroll: {
      position: 'relative',
      width: '230%',
      backgroundColor: theme.palette.background.paper,
      height: '230%',
    },
    legend: {
      marginTop: theme.spacing.unit * 2,
      maxWidth: 300,
    },
    paper: {
      maxWidth: 400,
      overflow: 'auto',
    },
    select: {
      width: 200,
    },
    popper: {
      zIndex: 1,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `${theme.palette.common.white} transparent transparent transparent`,
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
        },
      },
    },
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
    bootstrapButtonStyle: {
        marginLeft: 15,
        marginRight: 15,
        boxShadow: 'none',
        color: "white",
        border: '1px solid',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        textAlign: "center",
        cursor: "pointer"
    }
  });

class LabeledFieldWrapper extends PureComponent {

    constructor(props) {
        super(props);

        this.popperRef = React.createRef();
        this.inputRef = React.createRef();
    }

    componentDidMount = () => {
        document.addEventListener("mousedown", this.handleMouseDown, false);
    }

    componentWillUnmount = () => {
        document.removeEventListener("mousedown", this.handleMouseDown, false);
    }

    handleMouseDown = (event) => {
        if(this.popperRef.current) {
            if(!this.popperRef.current.contains(event.target) && this.state.open) {
                console.log("CLOSE")
                this.setState({open: false});
            }
        }     
    }

    state = {
        anchorEl: null,
        open: false,
        arrow: true,
        arrowRef: null
      };

    handleClick = event => {
        const { currentTarget } = event;
        this.setState(state => ({
          anchorEl: currentTarget,
          open: !state.open,
        }));
    };

    handleArrowRef = node => {
        this.setState({
          arrowRef: node,
        });
    };

    createQuickConfig = (event) => {
        const item = this.props.item;
        dispatchAction({type: "CREATE_QUICK_CONFIG", payload: {itemId: item.id, sceneId: item.sceneId, name: this.inputRef.current.value }})
        this.setState({open: false})
    }

    render() { 
        const { arrow, arrowRef } = this.state;
        let { keyVal, disabled, tooltip, type, disableAutomations, min, max } = this.props
        const { anchorEl, open } = this.state;
        const id = open ? 'simple-popper' : null;
        const iClasses = this.props.classes;

        return(
            <div key={keyVal} style={{width: "95%", display: "flex", flexDirection: "row", justifyContent:"space-between", marginBottom: 3, marginTop: 3}}>
                <Title tooltip={tooltip} min={min} max={max} keyVal={keyVal}></Title>
                
                <div style={{display: "flex", flexDirection: "row"}}>
                    <button className={iClasses.bootstrapButtonStyle} onClick={this.handleClick}>QC</button>
        
                    <Popper 
                        id={id} 
                        open={open} 
                        anchorEl={anchorEl} 
                        transition
                        className={iClasses.popper}
                        modifiers={{
                            arrow: {
                                enabled: arrow,
                                element: arrowRef,
                            }}}
                        >
  
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                
                                <Paper>
                                    {open ? <span className={iClasses.arrow} ref={this.handleArrowRef} /> : null}
                                    <div ref={this.popperRef} style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center", alignItems: "center"}}>
                                        Quick config name
                                        <input ref={this.inputRef} style={{margin: 4}}></input>
                                        <button onClick={this.createQuickConfig} className={iClasses.bootstrapButtonStyle} style={{width: 70}}>Add</button>
                                    </div>
                                </Paper>
                            </Fade>
                        )}
                        
                    </Popper>


                    {type === "Number" && disabled !== true && !disableAutomations &&
                       <AutomationIcon></AutomationIcon>
                    }
                    {this.props.children}
                </div>
            </div> 
        )
    }
}

export default withStyles(styles)(LabeledFieldWrapper)