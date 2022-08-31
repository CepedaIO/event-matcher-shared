import {Field, InputType} from "type-graphql";
import {IAvailabilityForm} from "../types";

@InputType()
export class RangeForm {
  @Field()
  start!: Date;

  @Field()
  end!: Date;
}

@InputType()
export class CreateEventInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  precision!: string;

  @Field()
  factor!: number;

  @Field()
  email!: string;

  @Field()
  displayName!: string;

  @Field(() => [RangeForm])
  availability!: IAvailabilityForm[];
}
