// tslint:disable: no-string-literal
// tslint:disable: prefer-const
// tslint:disable: variable-name
// tslint:disable: object-literal-key-quotes

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { API_URL } from './dashboard/config/config';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  apiUrl = API_URL;
  druidNodeUrl = API_URL;
  programName = 'Hepatitis - c Awareness';
  private dataDimension: any;


  private selectedFromDashboard = new BehaviorSubject<any>('');
  private barChartData = new BehaviorSubject<any>('');
  private stackedChartData = new BehaviorSubject<any>('');
  private multiLineChartData = new BehaviorSubject<any>('');
  private selected = new BehaviorSubject<any>('');
  private allTopics = new BehaviorSubject<any>('');
  public seletedTopics = new BehaviorSubject<any>('');
  public $allTopics = this.allTopics.asObservable();
  public $selectedFromDashboard = this.selectedFromDashboard.asObservable();
  public $barChartData = this.barChartData.asObservable();
  public $stackedChartData = this.stackedChartData.asObservable();
  public $multiLineChartData = this.multiLineChartData.asObservable();
  public $selected = this.selected.asObservable();
  public $selectedTopics = this.seletedTopics.asObservable();

  menuItems = [{ info: 'Participant Attestations', route: 'getCountForAttestation', ngroute: 'attestation',
   color: '#4A75B8 ', index: 1, extra: 'Number of Attestation' },
  { info: 'Sessions Completed', route: 'getCountForSessionCompleted', ngroute: 'session',
   color: '#1E8449', index: 2, extra: 'Number of Sessions' },
  { info: 'Content Views', route: 'getCountForDownload', ngroute: 'download',
   color: '#0B528A ', index: 3, extra: 'Number of Content Views' },
  { info: 'Unique Trainers', route: 'getCountForUniqueTrainer',
   color: '#5B2C6F ', index: 4, extra: 'Number of Unique Trainers' },
  { info: 'Unique Participants', route: 'getCountForUniqueTrainee',
   color: '#2E4053 ', index: 5, extra: 'Number of Unique Participants' }
  ];

  updateBar(data) {
    this.barChartData.next(data);
  }

  updateStacked(data) {
    this.stackedChartData.next(data);
  }

  updateSelected(data) {
    this.selected.next(data);
  }

  updatefromDashboard(data) {
    this.selectedFromDashboard.next(data);
  }

  setAllSelectedAxis(axis: { dimension: string, metric: string }, topics) {

    if (axis.metric === 'Unique Trainers' || axis.metric === 'Unique Participants') {
      if (axis.dimension === 'Time Period') {
        this.dataDimension = 'month';
        this.getDataByRole(this.dataDimension, this.programName, this.getEventType(axis.metric), topics);
      }
      if (axis.dimension === 'Location') {
        this.dataDimension = 'Location';
        this.getDataByRole(this.dataDimension, this.programName, this.getEventType(axis.metric), topics);
      }

    } else {
      if (axis.dimension === 'Time Period') {
        this.dataDimension = 'month';
        this.getDataByTime(this.programName, axis.metric, topics);
      }
      if (axis.dimension === 'Location') {
        this.dataDimension = 'Location';
        this.getDataByTime(this.programName, axis.metric, topics);
      }
    }

  }

  getEventType(metric) {
    if (metric === 'Sessions Completed') {
      return 'Session Completed';
    }
    if (metric === 'Participant Attestations') {
      return 'Generate Attestation';
    }
    if (metric === 'Content Views') {
      return 'Download Content';
    }

    if (metric === 'Unique Trainers') {
      return 'TRAINER';
    }

    if (metric === 'Unique Participants') {
      return 'TRAINEE';
    }
  }


  getDataforBar(program_name?, dimension?, event_type?, topics?) {
    let url = this.druidNodeUrl + 'getBarData';
    this.http.post(url, { event_type, program_name, dimension, topics }).subscribe((data) => {
      // console.log('bar', data)
      this.barChartData.next(data['data']);
    });
  }

  getStackedData(program_name?, dimension?, event_type?, topics?) {
    let url = this.druidNodeUrl + 'getStackedData';
    this.http.post(url, { event_type, program_name, dimension, topics}).subscribe((data) => {
      // console.log('stack', data)
      this.stackedChartData.next(data['data']);
    });
  }

  getmultiLineData(program_name?, dimension?, event_type?, topics?) {
    let url = this.druidNodeUrl + 'getMultiLineData';
    this.http.post(url, { event_type, program_name, dimension, topics }).subscribe((data) => {
      console.log('multi', data);
      this.multiLineChartData.next(data['data']);
    });
  }

  getTopics(program_name, event_type) {
    let url = this.druidNodeUrl + 'getAlltopics';
    this.http.post(url, { event_type, program_name }).subscribe((data) => {
      let alltopics = [];
      data['data'].forEach(element => {
        alltopics.push(element['topic_name']);
      });
      console.log('topics', _.uniq(alltopics));
      this.allTopics.next(_.uniq(alltopics));
    });
  }


  // added by aditya for UI Demo
  getDummyTopics() {
    let url = this.druidNodeUrl + 'getAlltopics';
    const program_name = this.programName;
    const event_type = 'Generate Attestation';
    return this.http.post(url, { event_type, program_name });
  }
    // added by aditya for UI Demo



  getDataByTime(program_name, event_type?, topics?) {
    let dataDimension = this.dataDimension;
    this.getDataforBar(program_name, dataDimension, this.getEventType(event_type), topics);
    this.getStackedData(program_name, dataDimension, this.getEventType(event_type), topics);
    this.getmultiLineData(program_name, dataDimension, this.getEventType(event_type), topics);
    this.getTopics(program_name, this.getEventType(event_type));
    // this.getDataByRole();
  }

  getDataByRole(dimension, program_name, role, topics?) {
    let obj = {
      'dimension': dimension,
      'program_name': program_name,
      'role': role,
      'topics': topics
    };
    this.http.post(this.druidNodeUrl + 'getBarData', obj).subscribe((data) => {
      // console.log('barRolr', data)
      this.barChartData.next(data['data']);
    });


    this.http.post(this.druidNodeUrl + 'getStackedData', obj).subscribe((data) => {
      // console.log('stackedRole', data)
      this.stackedChartData.next(data['data']);
    });


    this.http.post(this.druidNodeUrl + 'getMultiLineData', obj).subscribe((data) => {
      console.log('multiRole', data);
      this.multiLineChartData.next(data['data']);
    });


    this.http.post(this.druidNodeUrl + 'getAlltopics', obj).subscribe((data) => {
      let alltopics = [];
      data['data'].forEach(element => {
        alltopics.push(element['topic_name']);
      });
      console.log('topicsRole', _.uniq(alltopics));
      this.allTopics.next(_.uniq(alltopics));
    });

  }

}
