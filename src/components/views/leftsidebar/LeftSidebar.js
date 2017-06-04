import React from 'react';
import { Link, IndexLink } from 'react-router';
import SelectionPanel from './subcomponents/SelectionPanel';

class LeftSidebar extends React.Component{
	render(){
		return(
		<div>
			<div className="row-fluid">
				<IndexLink to="/" className="story-generator-logo"> <h2 className="app-title"> Akshada Monitoring Tool<sub className="alpha">ALPHA</sub> <hr className="title-hr" /></h2></IndexLink>
			</div>
			<div className="select-panel row-fluid">
				<SelectionPanel />
			</div>
			{/*<div className="social-icons-wrapper row-fluid">
				<ShareIcons />
			</div>*/}
			<div className="row-fluid">
			    <div className="col-lg-6">
				<a href="http://www.antarafoundation.org/" className="openbudgets-logo"> <h2 className="openbudgets-logo-header"> <img className="openbudgets-logo" src="http://antarafoundation.letternotes.com/wp-content/uploads/2016/11/antara-logo.png" /></h2></a>
			    </div>
                            <div className="col-lg-6">
				<a href="http://www.datakind.org/chapters/datakind-blr" className="openbudgets-logo"> <h2 className="openbudgets-logo-header"> <img className="openbudgets-logo" src="../../../images/DataKindBLR.png" /></h2></a>
                            </div>
			</div>
		</div>
		);
	}
}

export default LeftSidebar;
