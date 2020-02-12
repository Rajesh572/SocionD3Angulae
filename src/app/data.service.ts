import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash'
import { API_URL } from './dashboard/config/config';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  apiUrl = API_URL
  druidNodeUrl = API_URL;
  programName = "Hepatitis - c Awareness"
  private dataDimension: any;


  private selectedFromDashboard = new BehaviorSubject<any>('');
  private barChartData = new BehaviorSubject<any>('');
  private stackedChartData = new BehaviorSubject<any>('');
  private multiLineChartData = new BehaviorSubject<any>('');
  private selected = new BehaviorSubject<any>('');
  private allTopics = new BehaviorSubject<any>('');
  public seletedTopics = new BehaviorSubject<any>('')
  public $allTopics = this.allTopics.asObservable();
  public $selectedFromDashboard = this.selectedFromDashboard.asObservable();
  public $barChartData = this.barChartData.asObservable();
  public $stackedChartData = this.stackedChartData.asObservable();
  public $multiLineChartData = this.multiLineChartData.asObservable();
  public $selected = this.selected.asObservable();
  public $selectedTopics = this.seletedTopics.asObservable();

  menuItems = [{ info: "Number of Attestation Generated", route: 'getCountForAttestation', ngroute: 'attestation', color: "#E78F18", index: 1, extra: "Number of Attestation" },
  { info: "Number of Sessions Completed", route: 'getCountForSessionCompleted', ngroute: 'session', color: "#B1D5A3", index: 2, extra: "Number of Sessions" },
  { info: "Number of Content Views", route: 'getCountForDownload', ngroute: 'download', color: "#80A4F3", index: 3, extra: "Number of Content Views" },
  { info: "Number of Unique Trainers", route: 'getCountForUniqueTrainer', color: "#01ABBE", index: 4, extra: "Number of Unique Trainers" },
  { info: "Number of Unique Participants", route: 'getCountForUniqueTrainee', color: "#7FCAF0", index: 5, extra: "Number of Unique Participants" }
  ]

  updateBar(data) {
    this.barChartData.next(data);
  }

  updateStacked(data) {
    this.stackedChartData.next(data)
  }

  updateSelected(data) {
    this.selected.next(data);
  }

  updatefromDashboard(data) {
    this.selectedFromDashboard.next(data);
  }

  setAllSelectedAxis(axis: { dimension: string, metric: string },topics) {

    if (axis.metric === "Number of Unique Trainers" || axis.metric === "Number of Unique Participants") {
      if (axis.dimension === "Time Period") {
        this.dataDimension = "month"
        this.getDataByRole(this.dataDimension, this.programName, this.getEventType(axis.metric),topics)
      }
      if (axis.dimension === "Location") {
        this.dataDimension = "Location"
        this.getDataByRole(this.dataDimension, this.programName, this.getEventType(axis.metric),topics)
      }

    }
    else {
      if (axis.dimension === "Time Period") {
        this.dataDimension = "month"
        this.getDataByTime(this.programName, axis.metric,topics)
      }
      if (axis.dimension === "Location") {
        this.dataDimension = "Location"
        this.getDataByTime(this.programName, axis.metric,topics)
      }
    }

  }

  getEventType(metric) {
    if (metric === "Number of Sessions Completed") {
      return "Session Completed"
    }
    if (metric === "Number of Attestation Generated") {
      return "Generate Attestation"
    }
    if (metric === "Number of Content Views") {
      return "Download Content"
    }

    if (metric === "Number of Unique Trainers") {
      return "TRAINER"
    }

    if (metric === "Number of Unique Participants") {
      return "TRAINEE"
    }
  }


  getDataforBar(program_name?, dimension?, event_type?,topics?) {
    let url = this.druidNodeUrl + "getBarData";
    this.http.post(url, { event_type, program_name, dimension,topics }).subscribe((data) => {
      console.log("bar", data)
      this.barChartData.next(data['data'])
    })
  }

  getStackedData(program_name?, dimension?, event_type?,topics?) {
    let url = this.druidNodeUrl + "getStackedData";
    this.http.post(url, { event_type, program_name, dimension ,topics}).subscribe((data) => {
      console.log("stack", data)
      this.stackedChartData.next(data['data'])
    })
  }

  getmultiLineData(program_name?, dimension?, event_type?,topics?) {
    let url = this.druidNodeUrl + "getMultiLineData";
    this.http.post(url, { event_type, program_name, dimension,topics }).subscribe((data) => {
      console.log("multi", data)
      this.multiLineChartData.next(data['data'])
    })
  }

  getTopics(program_name, event_type) {
    let url = this.druidNodeUrl + "getAlltopics";
    this.http.post(url, { event_type, program_name }).subscribe((data) => {
      let alltopics = []
      data['data'].forEach(element => {
        alltopics.push(element['topic_name'])
      });
      console.log("topics",_.uniq(alltopics))
      this.allTopics.next(_.uniq(alltopics))
    })
  }

  getDataByTime(program_name, event_type?,topics?) {
    let dataDimension = this.dataDimension;
    this.getDataforBar(program_name, dataDimension, this.getEventType(event_type),topics)
    this.getStackedData(program_name, dataDimension, this.getEventType(event_type),topics)
    this.getmultiLineData(program_name, dataDimension, this.getEventType(event_type),topics)
    this.getTopics(program_name, this.getEventType(event_type));
    // this.getDataByRole();
  }

  getDataByRole(dimension, program_name, role,topics?) {
    let url = this.druidNodeUrl
    let obj = {
      "dimension": dimension,
      "program_name": program_name,
      "role": role,
      "topics":topics
    }
    this.http.post(this.druidNodeUrl + "getBarData", obj).subscribe((data) => {
      console.log("barRolr", data)
      this.barChartData.next(data['data'])
    })


    this.http.post(this.druidNodeUrl + "getStackedData", obj).subscribe((data) => {
      console.log("stackedRole", data)
      this.stackedChartData.next(data['data'])
    })


    this.http.post(this.druidNodeUrl + "getMultiLineData", obj).subscribe((data) => {
      console.log("multiRole", data)
      this.multiLineChartData.next(data['data'])
    })


    this.http.post(this.druidNodeUrl + "getAlltopics", obj).subscribe((data) => {
      let alltopics = []
      data['data'].forEach(element => {
        alltopics.push(element['topic_name'])
      });
      console.log("topicsRole", _.uniq(alltopics))
      this.allTopics.next(_.uniq(alltopics))
    })

  }

}
