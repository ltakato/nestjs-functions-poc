import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  callCat(): string {
    return 'call cat: Meowww';
  }

  greetCat(): string {
    return 'greet cat: Meow!';
  }

  taskCat(): string {
    return 'task cat: Meowwn';
  }
}
