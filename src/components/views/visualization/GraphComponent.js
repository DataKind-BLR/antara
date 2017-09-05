import React, {PropTypes} from 'react';
import { Link, IndexLink } from 'react-router';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  Hint,
  HorizontalGridLines,
  MarkSeries,
  VerticalGridLines,
  XAxis,FlexibleXYPlot,
  XYPlot,VerticalBarSeries,
  DiscreteColorLegend,
  DynamicHints,
  YAxis
} from 'react-vis';

import "../../../../node_modules/react-vis/dist/style.css";


const {LEFT, RIGHT, TOP, BOTTOM_EDGE, RIGHT_EDGE, TOP_EDGE} =
  Hint.ALIGN;

class GraphComponent extends React.Component {
    constructor(){
      super();
      this.state = {
        value : [],
        budgetAttr:null,
        selectedFigures:null,
        stateOptions:null,
        hoverValue:null,
        indicatorUnit:null,
        notesText:null,
        vizActive:true,
        concordanceData:null  
      };

      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.getrecord_figures = this.getrecord_figures.bind(this);
      this.onBarHover =this.onBarHover.bind(this);
      this.outBarHover = this.outBarHover.bind(this);
      this.setBudgetAttr = this.setBudgetAttr.bind(this);
      this.fillColor = this.fillColor.bind(this);

    }

    componentWillMount(){
      this.getrecord_figures();   
    }

    componentDidUpdate(prevProps, prevState){    
      if (this.state.budgetAttr != this.props.budgetAttr){
        this.setState({budgetAttr:this.props.budgetAttr});
      }

      if(prevState.value != this.state.value || prevState.budgetAttr != this.props.budgetAttr || prevProps.data != this.props.data ){
          if(this.state.value.length != 0){
          let stateArray = this.state.value.split(",");
          let selectedFigures = [];
          for(let selectedState in stateArray){
            selectedFigures.push(this.props.data.record_figures.find(function(value, index) {
            if(value.grpby_name == stateArray[selectedState]){
              return value.grpby_name;
               } 
             }
            ));
          }
          
          let currentState = this.state;
          let mungedFigures = [];
          selectedFigures.map(function(value, index){
            let tempState = {};
            tempState.name = value.grpby_name;
            tempState.figures = [];
            value.figures[currentState.budgetAttr].map(function(figure, index){
              let tempFigure = {};
              tempFigure.x = Object.keys(figure)[0];
              tempFigure.y = parseFloat(figure[Object.keys(figure)[0]]);
              tempFigure.grpby_name = value.grpby_name;
              tempState.figures.push(tempFigure);
            });
            mungedFigures.push(tempState);
          });
          
          if(this.state.value[0] == null && prevState.value != null){
            this.setState({selectedFigures:null});
          }
          else{
          this.setState({selectedFigures:mungedFigures});
         }
        }
      }
    }
    setBudgetAttr(){
      this.setState({budgetAttr:this.props.budgetAttr});
    }

    getrecord_figures(){
      let statesData = [];
      for(let state in this.props.data.record_figures){
        let temp = {};
        temp.value = this.props.data.record_figures[state].grpby_name;
        temp.label = this.props.data.record_figures[state].grpby_name;
        statesData.push(temp);
      }
      this.setState({stateOptions:statesData});
    }

    onBarHover(d, info){
      this.setState({hoverValue:d});
    }

    outBarHover(d, info){
      this.setState({hoverValue:null});
    }

    handleSelectChange (value) {
      this.setState({ value });
    }

    fillColor(value){
        if (value===0 ||value==null){
            return "#BFBFBF";
        }
        if(value <= 25){
            return "#FF0000";
        }
        if(value > 25 && value <= 50){
            return "#FFC000";
        }
        if(value > 50 && value <= 75){
            return "#ED7D31";
        }
        if(value > 75){
            return "#70AD47";
        }
    }

render (){
    let accessthis =this;
    const attributeKey = {"BE":" Budget Estimates", "RE":"Revised Estimates", "A":"Actuals"};
    const color = ['#26393D','#40627C','#D0A825','#D64700','#002A4A','#A7A37E','#B9121B','#1B1E26'].reverse();

    return(
     <div className="vis-wrapper">
        <div className="container-fluid graph-container">
          <div className="row">
            <div className="select-container">
              <div className="col-lg-12 state-select">
                <Select multi={true} simpleValue value={this.state.value} placeholder="Select a Sub Centre" options={this.state.stateOptions} onChange={this.handleSelectChange} />
              </div>
            </div>
          </div>

          {this.state.value[0] != null && this.state.selectedFigures !=null ? 
            (<div className="row legend-row">
              <DiscreteColorLegend
                orientation="horizontal"
                items={this.state.selectedFigures.map(function(value,index){
                  let figure = value.figures[0].y;
                  return {title: value.name, color:accessthis.fillColor(figure)};
                  })
                }
              />
            </div>)
            :
            (<div></div>)
          }
          <div className="row graph-area">
            {this.state.value[0] != null && this.state.selectedFigures !=null? (
              <div id="chart">
                <XYPlot
                  width={600}
                  height={300} 
                  xType="ordinal"
                  margin={{top:20, left:40, right:0, bottom:40}}>
                <HorizontalGridLines />
                
                <VerticalGridLines />
                {this.state.selectedFigures.map(function(state, index){ 
                let figure = state.figures[0].y;
                return(
                  <VerticalBarSeries
                    color={accessthis.fillColor(figure)}
                    onValueMouseOver = {accessthis.onBarHover}
                    onValueMouseOut = {accessthis.outBarHover}
                    data={state.figures}
                    key={state.name}
                    stroke={"grey"}
                    />
                    );
                })
              } 
             
              <XAxis title="Month(s)" />
              <YAxis title ="Indicator"/>

              {this.state.hoverValue ? 
              (<Hint value={this.state.hoverValue}  >
                  <div className="rv-hint__content">
                    <div>
                      <span className="rv-hint__title"> {this.state.hoverValue.grpby_name}</span>
                      <br />
                      <span className="rv-hint__title">Month(s) : </span>
                      <span className="rv-hint__value">{this.state.hoverValue.x}</span>
                    </div>
                    <div>
                      <span className="rv-hint__title">Figure : </span>
                      <span className="rv-hint__value">{this.state.hoverValue.y}</span>
                    </div>
                  </div> 
              </Hint>)
              :null
              }
            </XYPlot>
          </div>
          ):
            (<div className="col-lg-12 select-placeholder">
              <div className="jumbotron">
                <h2 className="text-center">Select Sub Centre to generate Visualization</h2>
              </div>
            </div>
            )
          }
          </div>
         </div>
      </div>
         );
  }
}


GraphComponent.propTypes = {
   data: React.PropTypes.object,
   budgetAttr:React.PropTypes.string
};

export default GraphComponent;
