# Data Generation Scripts
This directory contains a set of scripts used to generate the data for 

## `parse_mse_zip.py`
Ths is a python script dedicating to parsing Magic Set Editor (`.mse-set`) files, and converting the data into structured JSON format. This script also takes the images exported for the set and copies them into the correct folders in the `public/img/` directory. 

#### Usage

```bash
python parse_mse_zip.py <path_to_set_file> <path_to_image_directory>
```

## `query.pegjs`
This is a configuration file for `peg.js`, a javascript framework for producing parsers. This project uses it to power the search functionality. After installing `pegjs` with npm, run:
```bash
pegjs query.pegjs
```
This will produce a `query.js` file, which should be copied to `src/`