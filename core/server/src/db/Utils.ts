import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class RequestLog {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    system: "api"

    @Column({nullable: true})
    origin: string

    @Column()
    amount: number
}
