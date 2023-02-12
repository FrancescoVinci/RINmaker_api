# RINmakerAPI

A Rest API for **RINmaker**.\
RINmaker is a software developed by Ca'Foscari University.\
The *RINmakerRestAPI* is organized around [REST](https://en.wikipedia.org/wiki/Representational_state_transfer). The API has predictable URLs, accepts *form-encoded* and *JSON-encoded* request bodies, returns JSON-encoded responses, and uses standard HTTP response codes and verbs.\

## Endpoints
You can use the web service at:
```
https://rinmaker.dais.unive.it:8002/api/{endpoints}
```

- `/requestxml/fromname`
  | Method     | Parameters required | Description | 
  | ----------- | ----------- | ----------- | 
  | POST | '*pdbname*', *isRin*, *isCmap* | Returns the xml content of the processed file |
  
  `pdbname`: pdb or mmCif file name
  
  `isRin`: boolean
  
  `isCmap`: boolean

  Response:

  | Status Code | Response |
  | ----------- |----------- |
  | 🟢 200 | Returns the xml content |
  | 🔴 404 | File does not exist in rcbs.org |
  | 🟠 400 | Bad request, enter all the required parameters or make sure the parameters are correct |
  | 🟡 500 | Internal error |

  Other *non-mandatory* parameters:
  ```
  {
      no_hydrogen: boolean,
      keep_water: boolean,
      seq_sep: INT:POSITIVE = 3,
      illformed: ENUM:{kall,kres,sres}=sres,
      policy: ENUM:{all,multiple,one}=all,
      hydrogen_bond: FLOAT:POSITIVE=3.5,
      vdw_bond: FLOAT=0.5,
      ionic_bond: FLOAT:POSITIVE=4,
      pication_bond: FLOAT:POSITIVE=5,
      pipistack_bond: FLOAT:POSITIVE=6.5,
      h_bond_angle: FLOAT:POSITIVE=63,
      pication_angle: FLOAT:POSITIVE=45,
      pipistack_normal_normal: FLOAT:POSITIVE=30,
      pipistack_normal_centre: FLOAT:POSITIVE=60,
      type: ENUM:{ca,cb}=ca,
      distance: FLOAT:POSITIVE=6,
  }
  ```

- `/requestxml/fromcontent`
  | Method     | Parameters required | Description | 
  | ----------- | ----------- | ----------- | 
  | POST | '*pdbname*' , '*content*', *isRin*, *isCmap* | Returns xml content of processed . pdb content |
  

  Response:

  | Status Code | Response |
  | ----------- |----------- |
  | 🟢 200 | Returns an xml |
  | 🟠 400 | Bad request, enter all required parameters or and make sure the parameters are correct |
  | 🟡 500 | Internal error |

  Other *non-mandatory* parameters:
  ```JavaScript
  {
      no_hydrogen: boolean,
      keep_water: boolean,
      seq_sep: INT:POSITIVE = 3,
      illformed: ENUM:{kall,kres,sres}=sres,
      policy: ENUM:{all,multiple,one}=all,
      hydrogen_bond: FLOAT:POSITIVE=3.5,
      vdw_bond: FLOAT=0.5,
      ionic_bond: FLOAT:POSITIVE=4,
      pication_bond: FLOAT:POSITIVE=5,
      pipistack_bond: FLOAT:POSITIVE=6.5,
      h_bond_angle: FLOAT:POSITIVE=63,
      pication_angle: FLOAT:POSITIVE=45,
      pipistack_normal_normal: FLOAT:POSITIVE=30,
      pipistack_normal_centre: FLOAT:POSITIVE=60,
      type: ENUM:{ca,cb}=ca,
      distance:	FLOAT:POSITIVE=6
  }
  ```
  
## Usage

  
 - `https://rinmaker.dais.unive.it:8002/api/requestxml/fromname`
 
    Sample Json:
    ```JavaScript
    {
        "pdbname" : "6a90.pdb",
        "isRin": true,
        "isCmap": false,
        "seq_sep" : "5",
        "h_bond" : "4.5",
        "ionic_bond" : "4.6"
    }

    ```
    Response:
    ```JavaScript
    {
        "response": "success",
        "data": {
            "code": 200,
            "message": "Processing completed successfully",
            "log": "..."
            "xml": "<?xml ... >"
        }
    }
    ```
  
 - `https://rinmaker.dais.unive.it:8002/api/requestxml/fromcontent`
  
    Sample Json:
    ```JavaScript
    {
        "pdbname" : "6a90.pdb",
        "content" : "...",
        "h_bond" : "4.5",
        "ionic_bond" : "4.6"
    }
    ```
    Response:
    ```JavaScript
    {
        "response": "success",
        "data": {
            "code": 200,
            "message": "Processing completed successfully",
            "log": "...,
            "xml": "<?xml ... >"
        }
    }
    ```

## Built With
* [Node.js](https://nodejs.org/it/) 
 
