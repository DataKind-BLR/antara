import { indicator_data }  from "../data/kishanganj_shc_pcts_data";
import { expenditure_metadata } from "../data/expenditure_metadata";
import { expenditure_concordance_data } from "../data/expenditure_concordance_data";
import { DataKindBLR } from "../styles/DataKindBLR.png";
let appConfig = {
	"app.title" : "Akshada Monitoring Tool",
	"app.version" : "ALPHA"
		
};

let homeComponent = {
	"primary_header": "Akshada Monitoring Tool", // Text Only
	"secondary_header" : "Story Generator", // Text 
	"description" : "This tool enables better tracking of maternal and child health indicators on a Block Map.",
	"contributor_organizations" : [{
		"url": "http://www.antarafoundation.org/wp-content/uploads/2017/08/Antara-Revised-Logo.jpg",
		"alt":"Antara Foundation Logo",
		"image_name":"Antara Foundation Logo",
		"id":"openbudgetsindia_logo",
		"height": "50",
		"link":"http://www.antarafoundation.org/"
	},{
		"url": "images/DataKindBLR.png",
		"alt":"DataKind Bangalore Logo",
		"image_name":"DataKind Bangalore Logo",
		"id":"datakind_logo",
		"height":"30",
		"link" : "http://www.datakind.org/chapters/datakind-blr"
	}]
};

let leftSideBarComponent = {
	"top_logo": {
		"format" : "text", // text/img
		"text_config" : {
			"text" : "Akshada Monitoring Tool", // Null for img and text value if top-logo-format is  
			"release_version" : "ALPHA" // Alpha/PreALPHA/BETA	
		},
		"img_config" :{
			"source": "http://www.antarafoundation.org/wp-content/uploads/2017/08/Antara-Revised-Logo.jpg", // null if text else provide link for images.	
			"width": "270",
			"height" : ""
		}
	},
	"bottom_logo" : { // To represent organization logo.
			"contributor_organizations" : [{
			"url": "http://www.antarafoundation.org/wp-content/uploads/2017/08/Antara-Revised-Logo.jpg",
			"alt":"Antara Foundation Logo",
			"image_name":"Anatara Foundation Logo",
			"id":"openbudgetsindia_logo",
			"height": "30",
			"link":"http://www.antarafoundation.org/"
		},{	
			"url": "images/DataKindBLR.png",
			"alt":"DataKind Bangalore Logo",
			"image_name":"DataKind Bangalore Logo",
			"id":"datakind_logo",
			"height":"13",
			"link" : "http://www.datakind.org/chapters/datakind-blr"
		}],

		"img_config" :{
			"source": "http://antarafoundation.letternotes.com/wp-content/uploads/2016/11/antara-logo.png", // null if text else provide link for images.	
			"width": "250", //Image width
			"height" : "", // Image height
			"link" : "http://www.antarafoundation.org/" // Hyperlink to the organization
		}
	},
	"selection_panel" :{
		"panels" : [
		{
			"isActive" : "true",
			"title" : "Indicator",
			"title_slug" : "indicator",
			"heirarchy_level" : "2",
			"data" : indicator_data	
		}
		]
	}
};

let appController = {
	dataseries: [{
		"title" : "Indicator",
		"title_slug" : "indicator",
		"heirarchy_level" : "2",
		"data" : indicator_data,
		"primary_header" : "record",
		"secondary_header" : "category_name",
		"meta_data" : expenditure_metadata,
		"addtional_meta_data" : expenditure_concordance_data
	}]
};

let appComponents = {
	"homeComponent" : homeComponent,
	"leftSideBarComponent" :leftSideBarComponent,
	"appController" : appController
};


export {appConfig, homeComponent, leftSideBarComponent, appComponents, appController};
