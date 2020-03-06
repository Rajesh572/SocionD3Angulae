import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {

  requestBody = [];
  programDetails = {
    progrma_name: 'Hepatitis - c Awareness',
    program_id: 236
};

  initialHorizontalAttSelected = 'Time Period';
  initialVerticalAttSelected = 'Sessions Completed';

  requestDimensionAndGranularity = [{'Time Period': {
    dimension: 'month',
    granularity: 'Month',
  }},
  {'Location': {
    dimension: 'location',
    granularity: 'All',
  }}
];

  // chartOptions = [{
  //   params: {
  //     event_type: ['Generate Attestation', 'Session Completed', 'Download Content']
  //   }
  // },
  // {
  //   unique: true,
  //   unique_param: 'user_id',
  //   params: {
  //     role: ['TRAINER', 'TRAINEE']
  //   }
  // }
  // ];

  constructor() { }

  applyFiltersToRequestBody(filter) {
    const filterKeys = Object.keys(filter);
    filterKeys.forEach((element) => {
      this.requestBody.forEach((item) => {
        item.filter[element] = filter[element];
      });
    });
  }

  initializeRequestBody() {
    this.requestBody = [];
    this.requestDimensionAndGranularity.forEach((option) => {
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

  getRequestBody() {
    return [...this.requestBody];
  }
}
