import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { FavouriteEntity } from './favourite.entity';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => PostEntity, (post) => post.createdBy)
  @JoinColumn({ name: 'created_by' })
  user: UserEntity;

  @OneToMany(() => PostEntity, (post) => post.favourites)
  favourites: FavouriteEntity[];
}
