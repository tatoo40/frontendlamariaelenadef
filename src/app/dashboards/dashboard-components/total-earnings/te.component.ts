import { Component } from '@angular/core';
@Component({
  selector: 'app-te',
  standalone: true,
  templateUrl: './te.component.html'
})
export class TotalEarningComponent {
  constructor() {}

  totalearnings: any[] = [
    {
      image: 'assets/images/users/user1.jpg',
      name: 'Andrew Simon',
      labelcolor: 'label-light-info',
      amount: '$2600'
    },
    {
      image: 'assets/images/users/user2.jpg',
      name: 'Daniel Kristeen',
      labelcolor: 'label-light-success',
      amount: '$2300'
    },
    {
      image: 'assets/images/users/user3.jpg',
      name: 'Dany John',
      labelcolor: 'label-light-primary',
      amount: '$1200'
    },
    {
      image: 'assets/images/users/user4.jpg',
      name: 'Chris gyle',
      labelcolor: 'label-light-warning',
      amount: '$4400'
    },
    {
      image: 'assets/images/users/user5.jpg',
      name: 'Jane Doe',
      labelcolor: 'label-light-danger',
      amount: '$2500'
    },
    {
      image: 'assets/images/users/user1.jpg',
      name: 'Jon doe',
      labelcolor: 'label-light-megna',
      amount: '$3300'
    }
  ];
}
