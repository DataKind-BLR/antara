'''The script converts pcts indicator data from csv format into the reqruired
json format for story generator.

The script requires two files:
    - data file containing the indicators.
    - config file containing information on the categories their sub categories
    and the respective column to pick up.

NOTE: The data passed to the script needs to be in a cleaned format and all
target columns in the config file should be present in the data file.

Sample of the json to be generated :

    [{ "category_slug": "ante_natal_care_services",
	"sub_records": [{"record_slug": "number_of_anc_registrations",
					 "record_name": "Number of ANC Registrations",
                     "unit": "",
					 "record_figures": [{
						 "figures":{"target_pregnant_woman":{ "2016-17": 137 } },
						 "grpby_name": "Asnawar"
                         },
                         {
                         "figures":{"target_pregnant_woman":{ "2016-17": 100 } },
						 "grpby_name": "Badipura"
                         }
                         ...
                         ...
                         ...]
                     },
					{"record_slug": "number_of_pregnant_registered_before_12_weeks",
					 "record_name": "Number of Pregnant Registered Before 12 Weeks",
                     "unit":"",
                     "record_figures": [{
						 "figures":{"number_of_pregnant_registered_before_12_weeks":{
                         "2016-17": 137 } },
						 "grpby_name": "Asnawar"
                         },
                         {
                         "figures":{"number_of_pregnant_registered_before_12_weeks":{
                         "2016-16": 100 } },
						 "grpby_name": "Badipura"
                         }
                         ...
                         ...
                         ...]
                    }]

    }]
'''
import json
import argparse
import re
import pandas as pd


class GenerateJsonData(object):
    '''Given a data file and config file in csv format generate the json to be
    used in story generator.

    The Config file should contain hierarchy information in each row, with
    columns as :-
        - Category = This is the highest level category that will be displayed
            on the left nav bar of story generator.
        - Sub Cateogry = These are the name of the options that will be displayed
            under a category.
        - Target Column = This is the map of the column from the `data` dataframe
            that needs to be used as values
        - unit = The unit with which the value needs to be extended.

    The data file should contain in this case some base columns `S.No.`,
    `Block`, `Sector`, `SHC` and all the column names mentioned in the
    `Target Column` in the config file.
    '''

    def __init__(self, data_file_path, config_file_path):
        '''
        Read and set the file paths

        Args:
            - data_file_path (string): path to data file.
            - config_file_path (string): path to the config file.
        '''
        self.data_file_path = data_file_path
        self.config_file_path = config_file_path
        self.data = self.config = None

    def load_data(self):
        '''
        Load the config file and data file.

        Returns:
            None
        '''
        self.data = pd.read_csv(self.data_file_path)
        self.config = pd.read_csv(self.config_file_path)
        return None

    @staticmethod
    def generate_slug(string_val):
        '''Convert a string value to a slug.

        Args:
            - string_val (string): A string value to be slugged.

        Returns:
            A slugged string.
        '''
        return re.sub('[^0-9a-zA-Z]+', '_', string_val.lower())

    def generate_json_data(self, output_json_file):
        '''Generate json from data and config file.

        Args:
            output_json_file (string): The json file path where to store the
            json data. 
        '''
        if self.data is None or self.config_file_path is None:
            self.load_data()
        data = self.data
        json_data = []
        meta_cols = ['SHC', 'Sector', 'Block']
        for category, group in self.config.groupby('Category'):
            category_slug = self.generate_slug(category)
            category_json = {'category_slug': category_slug,
                             'sub_records': []}
            for _, row in group.iterrows():
                record = {}
                record['record_name'] = row['Sub Category']
                record['record_slug'] = self.generate_slug(row['Sub Category'])
                record['unit'] = row['unit']
                record['record_figures'] = []
                cols = meta_cols + [row['Target Column']]
                for _, sub_row in data[cols].iterrows():
                    figures = {'BE': [{'May, 2017-18': sub_row[row['Target Column']]}]}
                    record['record_figures'].append({
                        'figures': figures,
                        'grpby_name': sub_row['SHC'],
                        'shc': sub_row['SHC'],
                        'block': sub_row['Block'],
                        'sector': sub_row['Sector']
                    })
                category_json['sub_records'].append(record)
            json_data.append(category_json)
        with open(output_json_file, 'w') as json_data_file:
            json.dump(json_data, json_data_file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generate json file from csv data file and config file.")
    parser.add_argument("input_pcts_data_file", metavar='d', help="Input PCTS data file")
    parser.add_argument("input_config_file", metavar='c', help="Input config file")
    parser.add_argument("output_json_file", metavar='o', help="Output CSV filepath")
    args = parser.parse_args()
    print(args)
    data_file_path = args.input_pcts_data_file
    config_file_path = args.input_config_file
    

