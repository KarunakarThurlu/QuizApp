/*import React, {  useRef } from 'react';
import Home from "../HomeComponent/Home";
import { Link } from "react-router-dom"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import GridLayout from 'react-grid-layout';


const GridStackJsDashBoard = (props) => {
  const spline = {
    chart: {
      type: 'spline',
      reflow: true,
    },
    yAxis: [
      {
        gridLineWidth: 0,
        yAxis: 1,
        title: {
          color: ["#112233"],
          text: 'Questions Count',
        },
      }
    ],
    xAxis: {
      categories: ["f", "v", "b", "h", "l", "c", "d", "s", "m", "e", "g", "p", "q", "t", "u", "w", "x", "y", "z"],
      title: {
        text: 'TopicName ',
      },
    },
    title: {
      text: 'My chart'
    },
    events: {
      load() {
        setTimeout(this.reflow.bind(this), 0);
      },
    },
    series: [{
      data: [1, 12, 33, 145, 5, 16, 7, 108, 9, 110,1, 12, 33, 45, 5, 16, 7, 108, 9, 10,1, 12, 3, 15, 5, 16, 7, 108, 9, 10]
    }]
  }
  const column = {
    yAxis: [
      {
        gridLineWidth: 0,
        yAxis: 1,
        title: {
          color: ["#115233"],
          text: 'Questions Count',
        },
      }
    ],
    xAxis: {
      categories: ["f", "v", "b", "h", "l"],
      title: {
        text: 'TopicName',
      },
    },
    title: {
      text: 'My chart'
    },
    series: [{
      type: 'column',
      data: [10, 12, 3, 14, 5, 16, 7, 18, 9, 10]
    }]
  }
  const bar = {
    yAxis: [
      {
        gridLineWidth: 0,
        yAxis: 1,
        title: {
          color: ["#115233"],
          text: 'Questions Count',
        },
      }
    ],
    xAxis: {
      categories: ["f", "v", "b", "h", "l"],
      title: {
        text: 'TopicName',
      },
    },
    title: {
      text: 'My chart'
    },
    series: [{
      type: 'pie',
      data: [10, 12, 33, 145, 5, 16, 7, 108, 9, 100]
    }]
  }


  const firstChart = useRef(null);
  const secondChart = useRef(null);
  const thirdChart = useRef(null);
 

  const layoutLg = [
    {i: 'a', x: 0, y: 0, w: 4, h: 2,resizeHandles:["ne","se","sw","nw"]},
    {i: 'b', x: 4, y: 0, w: 4, h: 2,resizeHandles:["ne","se","sw","nw"]},
    {i: 'c', x: 8, y: 0, w: 4, h: 2,resizeHandles:["ne","se","sw","nw"]},
    {i: 'd', x: 12, y: 1, w: 12, h: 2,resizeHandles:["ne","se","sw","nw"]}
  ];
  const layoutSm = [
    {i: 'a', x: 0, y: 0, w: 2, h: 1,resizeHandles:["ne","se","sw","nw"]},
    {i: 'b', x: 1, y: 0, w: 2, h: 1,resizeHandles:["ne","se","sw","nw"]},
    {i: 'c', x: 2, y: 0, w: 1, h: 1,resizeHandles:["ne","se","sw","nw"]},
    {i: 'd', x: 3, y: 0, w: 1, h: 1,resizeHandles:["ne","se","sw","nw"]}
    
  ];
  const mView={
    layout:layoutSm,
    columns:1,
    width:350,
  }
  const Dview={
    layout:layoutLg,
    columns:12,
    width:1350,
  }
  let layout=window.innerHeight>613?mView:Dview
 
  const onLayoutChange = (i) => {
    Highcharts.charts.forEach((v,i,a) => {
      if (Highcharts.charts[i] !== undefined)
        Highcharts.charts[i].reflow(); 
    })
  };

  return (
    <div className="dashboard">
      <Home />
      <div className="header">
        <ul>
          <Link to="/questionsdashboard">Questions</Link>
          <Link>Users</Link>
          <Link>Exams</Link>
        </ul>
      </div>
      <div >
      <GridLayout className="layout"  onLayoutChange={(e) => onLayoutChange(e)} 
       layout={layout.layout} cols={layout.columns} rowHeight={200} width={layout.width}>
        <div key="a">
        <HighchartsReact
              highcharts={Highcharts}
              options={spline}
             ref={firstChart}
             containerProps={{ style: { width: '100%', height: '100%' } }}
            />
        </div>
        <div key="b">
        <HighchartsReact highcharts={Highcharts} 
            options={column}   
            ref={secondChart}
            containerProps={{ style: { width: '100%', height: '100%' } }}
            />
            
        </div>
        <div key="c">
         <HighchartsReact highcharts={Highcharts}
             ref={thirdChart} 
             options={bar} containerProps={{ style: { width: '100%', height: '100%' } }}
              />
        </div>
        <div key="d">
         <HighchartsReact highcharts={Highcharts}
             ref={thirdChart} 
             options={bar} containerProps={{ style: { width: '100%', height: '100%' } }}
              />
        </div>
      </GridLayout>
       </div>
    </div>
  );
}

export default GridStackJsDashBoard;

*/