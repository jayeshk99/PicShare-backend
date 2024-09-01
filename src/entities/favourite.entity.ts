import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity({ name: 'favourite' })
export class FavouriteEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => FavouriteEntity, (favourite) => favourite.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => FavouriteEntity, (favourite) => favourite.postId)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
