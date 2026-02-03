import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FeaturesObj, JobObj } from '../../../public/assets/models/valholl-interfaces';
import { RandomNumber } from '../services/random-number';
import { JOBS } from '../../../public/assets/valholl.constants';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-job',
  imports: [UpperCasePipe],
  templateUrl: './job.html',
  styleUrl: './job.scss',
})
export class Job implements OnInit {
  constructor (
    private randomNumberService: RandomNumber
  ) {}

  @Output() jobEmitter: EventEmitter<JobObj> = new EventEmitter();

  jobsArray: JobObj[] = [];
  jobObj: JobObj = {} as JobObj;
  chosenFeature: FeaturesObj = {} as FeaturesObj;

  ngOnInit(): void {
      this.jobsArray = this.randomNumberService.shuffle(JOBS);
      this.jobObj = this.jobsArray[0];

      this.jobObj.features = this.randomNumberService.shuffle(this.jobObj.features);

      this.chosenFeature = this.jobObj.features[0];
      this.jobEmitter.emit(this.jobObj);
  }

  rerollJob() {
    let newIndex = this.jobsArray.findIndex(job => job.name === this.jobObj.name);
    const isEndOfArray = this.jobsArray.length === newIndex + 1;

    newIndex = isEndOfArray ? 0 : newIndex += 1;

    this.jobObj = this.jobsArray[newIndex];
    this.jobEmitter.emit(this.jobObj);
    this.rerollFeature();
  }

  rerollFeature() {
    let newIndex = this.jobObj.features.findIndex(feature => feature.title === this.chosenFeature.title);
    const isEndOfArray = this.jobObj.features.length === newIndex + 1;

    if (isEndOfArray) {
      newIndex = 0;
    } else {
      newIndex += 1;
    }

    this.chosenFeature = this.jobObj.features[newIndex];
  }
}
