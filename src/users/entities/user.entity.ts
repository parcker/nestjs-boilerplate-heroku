import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, QueryFailedError, BaseEntity, OneToOne, JoinColumn} from 'typeorm';
import {IsEmail, IsNotEmpty, Validator} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Business } from '../../entities/business.entity';

@Entity('users')
export class User extends BaseEntity
{
    private static DEFAULT_SALT_ROUNDS = 10;

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsNotEmpty()
    public username: string;

    @Column()
    @IsNotEmpty()
    public email: string;

    @Column()
    public emailConfirmed: boolean;

    @Column()
    @IsNotEmpty()
    public passwordHash: string;

    @Column()
    @IsNotEmpty()
    public securityStamp: string;

    @Column()
    public twoFactorEnable: boolean;
    
    @Column()
    public accessFailedCount: number;

    @Column()
    @IsNotEmpty()
    public firstName: string;

    @Column()
    public lastName: string;
    
    @Column()
    @IsNotEmpty()
    public password: string;

    @Column()
    public isDisabled: boolean;
    
    @Column()
    @IsNotEmpty()
    public phonenumber: string;

    @OneToOne(() => Business)
    @JoinColumn()
    business: Business;
    
    public toJSON() {
        return {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phonenumber:this.phonenumber,

        }
    }
  

    @BeforeInsert()
    private async encryptPassword() {
        this.passwordHash = await bcrypt.hash(this.passwordHash, User.DEFAULT_SALT_ROUNDS);
        this.isDisabled=false;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validateEmail() {
        const validator = new Validator();
        if (!validator.isEmail(this.email)) throw new QueryFailedError('', [], 'email is not a valid email');
    }
}
