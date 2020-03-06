import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from './../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  programDetails = {
    progrma_name: 'Hepatitis - c Awareness',
    program_id: 236
};
apiUrl = API_URL;

colorOption  = ['#4A75B8',
'#1E8449',
'#0B528A',
'#5B2C6F',
'#2E4053'
];

titleInfo = {'Session Completed': 'Sessions Completed',
'Generate Attestation': 'Participant Attestations',
TRAINEE: 'Unique Participants',
TRAINER: 'Unique Trainers',
'Download Content': 'Content Views'};

keys = ['event_type', 'role'];
  menuOptions = [{
    params: {
      event_type: ['Generate Attestation', 'Session Completed', 'Download Content']
    }
  },
  {
    unique: true,
    unique_param: 'user_id',
    params: {
      role: ['TRAINER', 'TRAINEE']
    }
  }
  ];

  requestBody = [];

  constructor(private http: HttpClient) { }

  initializeRequestBody() {
    this.requestBody = [];
    this.menuOptions.forEach((option) => {
      // console.log('option : ', option);
      const requestBody = this.checkUniqueOption(option);
      const paramObject = this.createParamsObject(option.params);
      requestBody['params'] = paramObject;

      const filterObject = this.createFilterObject(this.programDetails.program_id);
      // console.log('Filter : ', filterObject);
      requestBody['filter'] = filterObject;
      // console.log('Request : ', requestBody);
      this.requestBody.push(requestBody);
    });
  }

  applyFiltersToRequestBody(filter) {
    const filterKeys = Object.keys(filter);
    filterKeys.forEach((element) => {
      this.requestBody.forEach((item) => {
        item.filter[element] = filter[element];
      });
    });
  }

  getRequestBody() {
    return [...this.requestBody];
  }

  getProgramDetails() {
    return {...this.programDetails};
  }

  getMenuOptions() {
    return [...this.menuOptions];
  }

  checkUniqueOption(filterObject) {
    const requestBody = {};
    if (filterObject.unique) {
      requestBody['unique'] = filterObject.unique;
      requestBody['unique_param'] = filterObject.unique_param;
    }
    return requestBody;
  }

  createFilterObject(programId) {
    const filter = {};
    filter['program_id'] = programId;
    // const filterKeys = Object.keys(filterObject);
    // filterKeys.forEach((element) => {
    //   filter[element] = filterObject[element];
    // });
    return filter;
}
createParamsObject(params) {
  const paramsObject = {};
  const paramKeys = Object.keys(params);
  paramKeys.forEach((element) => {
    paramsObject[element] = params[element];
  });
  return paramsObject;
}

getDashboardData(requestBody) {
  console.log(requestBody);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  return this.http.post('/v1/api/event/count/read', {request: requestBody}, httpOptions);
}

addColorsAndTitle(data) {
  let colorIndex = 0;
  const colorLength = this.colorOption.length;
  data.forEach((dataEach) => {
    // add color of blocks
    dataEach['color'] = this.colorOption[colorIndex];
    colorIndex++;
    if (colorIndex >= colorLength) {
      colorIndex -= colorLength;
    }

        // add title of blocks
    for (let i=0; i<this.keys.length; i++) {
      if (!!dataEach[this.keys[i]]) {
        dataEach['title'] = this.titleInfo[dataEach[this.keys[i]]];
        break;
      }
    }
  });

  return data;
}
}
