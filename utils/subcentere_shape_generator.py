'''Script for generating shape WKT files for Health SHC from Rajasthan PCTS data & Village GIS

Acronyms Used:

ARGS: Arguments
CSV: Comma-Separated Values
PCTS: Pregnancy, Child Tracking & Health Services 
PHC: Primary Health Centers
SHC: Sub-health Centers
WKT: Well-Known Text

'''

import argparse
import csv 
import json
import pandas as pd
import os
from shapely.ops import cascaded_union
from shapely.wkt import loads as load_wkt

STOP_WORD = "\xca"

class SubcentreShapeGenerator():
    '''Class for generating shape WKT files for Health SHC from Rajasthan PCTS data & Village GIS
    '''
    def __init__(self):
        self.village2shc_map_df = None
        self.village_shape_df = None
        self.subcentre_shape_map = {}
        
    def load_data_frames(self, input_pcts_data_file, input_village_map_file):
        '''Load Pandas data frames with input data
            
           Args:
                - input_pcts_data_file (string): File path for input PCTS data
                - input_village_map_file (string): File path for input village GIS data, must have 'CENSUS_CD_2011'
        '''
        self.village2shc_map_df = pd.read_csv(input_pcts_data_file)
        self.village_shape_df = pd.read_csv(input_village_map_file).set_index('CENSUS_CD_2011')
        
    def get_cleaned_key(self, key):
        '''Remove stop words, extra space and case from the key
           
           Args:
                - key (string): Column values from PCTS data i.e. PHC or SHC names
        '''
        if not pd.isnull(key):
            return str(key).replace(STOP_WORD, "").lower().strip()
        
    def is_key(self, key):
        '''Checks whether key is null or not
           
           Args:
                - key (string): Column values from PCTS data i.e. PHC or SHC names
        '''
        if not pd.isnull(key) and key:
            return True
        else:
            return False
    
    def load_subcentre_shape_map(self):
        '''Loads subcentre shape map as Python dictionary   
        '''
        subcentre_key = None
        subcentre_villages = []
        for index, row in self.village2shc_map_df.iterrows():
            row[1] = self.get_cleaned_key(row[1])
            row[2] = self.get_cleaned_key(row[2])
            if self.is_key(row[1]) or self.is_key(row[2]):
                if subcentre_villages and subcentre_key:
                    subcentre_villages.sort()
                    self.subcentre_shape_map[subcentre_key] = {"name" : subcentre_key, "villages" : subcentre_villages}
                    subcentre_villages = []
                    subcentre_key = None
                if self.is_key(row[1]):
                    subcentre_key = row[1]
                elif self.is_key(row[2]):
                    subcentre_key = row[2]
            subcentre_villages.append(row[5])
        if subcentre_villages and subcentre_key:
            self.subcentre_shape_map[subcentre_key] = {"name" : subcentre_key, "villages" : subcentre_villages}
    
    def merge_village_shapes(self):
        '''Merge village shape objects into SHC shape objects, objects being WKT
        '''
        for subcentre in self.subcentre_shape_map:
            village_shape_list = []
            village_list = self.subcentre_shape_map[subcentre]["villages"]
            for village_id in village_list:
                village_row = self.village_shape_df.loc[village_id]
                village_shape = load_wkt(village_row[0])
                village_shape_list.append(village_shape)
            subcentre_shape = cascaded_union(village_shape_list) 
            subcentre_wkt = subcentre_shape.wkt
            self.subcentre_shape_map[subcentre]["geo_wkt"] = subcentre_wkt
    
    def generate_out_shape_csv(self, input_pcts_data_file, input_village_map_file, output_shc_map_file):
        '''Generate output WKT shapefile for SHCs
            
           Args:
                - input_pcts_data_file (string): File path for input PCTS data
                - input_village_map_file (string): File path for input village GIS data 
                - output_shc_map_file (string): File path for output SHC map data
        '''
        self.load_data_frames(input_pcts_data_file, input_village_map_file)
        self.load_subcentre_shape_map()
        self.merge_village_shapes()
        out_csv_file = open(output_shc_map_file, "wb")
        csv_writer = csv.writer(out_csv_file, delimiter=',')
        csv_header = self.subcentre_shape_map.values()[0].keys()
        csv_writer.writerow(csv_header)
        for subcentre in self.subcentre_shape_map:
            csv_writer.writerow(self.subcentre_shape_map[subcentre].values())
        out_csv_file.close()
        
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generates shape WKT files for Health Subcenters from Rajasthan PCTS data & Village GIS")
    parser.add_argument("input_pcts_data_file", help="Input PCTS data file")
    parser.add_argument("input_village_map_file", help="Input filepath for village maps")
    parser.add_argument("output_shc_map_file", help="Output CSV filepath")
    args = parser.parse_args()
    if not args.input_pcts_data_file or not args.input_village_map_file or not args.output_shc_map_file: 
        print("Please pass input and output filepaths")
    else:
        obj = SubcentreShapeGenerator()
        obj.generate_out_shape_csv(args.input_pcts_data_file, args.input_village_map_file, args.output_shc_map_file)
