import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {

  requestBody = [];
  programDetails = {
    progrma_name: 'Hepatitis - c Awareness',
    program_id: 236
};

selectedVerticalAttr = 'Session Completed';
selectedHorizontalAttr = 'Time Period';

titleInfo = {'Session Completed': 'Sessions Completed',
'Generate Attestation': 'Participant Attestations',
TRAINEE: 'Unique Participants',
TRAINER: 'Unique Trainers',
'Download Content': 'Content Views'};

  initialHorizontalAttrSelected = 'Time Period';
  initialVerticalAttrSelected = 'Session Completed';
  initialGranularity = 'month';

  requestDimensionAndGranularity = [{'Time Period': {
    dimension: 'topic_name',
    granularity: 'Month',
  }},
  {'Location': {
    dimension: 'location',
    granularity: 'All',
  }}
];

  chartOptions = [{
    granularity: 'month',
    dimension: ['month']
  },
  {
    granularity: 'month',
    dimension: ['topic_name', 'month']
  }
  ];

  constructor(private http: HttpClient) { }

  applyFiltersToRequestBody(filter) {
    const filterKeys = Object.keys(filter);
    filterKeys.forEach((element) => {
      this.requestBody.forEach((item) => {
        item.filter[element] = filter[element];
      });
    });
  }

  getSelectedVerticalAttr() {
    return this.titleInfo[this.selectedVerticalAttr];
  }

  getSelectedHorizontalAttr() {
    return this.selectedHorizontalAttr;
  }

  initializeRequestBody() {
    this.requestBody = [];
    this.chartOptions.forEach((option) => {
      const requestBody = {...option};
      // console.log('option : ', option);
      // const requestBody = this.checkUniqueOption(option);
      // const paramObject = this.createParamsObject(option.params);
      // requestBody['params'] = paramObject;
      const filterObject = this.createFilterObject(this.programDetails.program_id, this.initialVerticalAttrSelected);
      // console.log('Filter : ', filterObject);
      requestBody['filter'] = filterObject;
      // console.log('Request : ', requestBody);
      this.requestBody.push(requestBody);
    });
  }

  createFilterObject(programId, initialVerticalAttrSelected) {
    const filter = {};
    filter['program_id'] = programId;
    filter['event_type'] = initialVerticalAttrSelected;
    // const filterKeys = Object.keys(filterObject);
    // filterKeys.forEach((element) => {
    //   filter[element] = filterObject[element];
    // });
    return filter;
}

  getRequestBody() {
    return [...this.requestBody];
  }

  getChartData(requestBody) {
    console.log(requestBody);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('/v1/api/chart/data/read', {request: requestBody}, httpOptions);
  }
}
