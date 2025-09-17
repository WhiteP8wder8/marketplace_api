import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string | Buffer);
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
