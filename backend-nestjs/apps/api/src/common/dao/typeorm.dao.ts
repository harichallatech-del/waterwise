import {DeepPartial,FindOptionsWhere,Repository} from 'typeorm';import {Dao,FindOptions} from './dao.interface';
export abstract class TypeOrmDao<T extends {id:string},C=DeepPartial<T>,U=DeepPartial<T>> implements Dao<T,C,U>{
 protected constructor(protected readonly repo:Repository<T>){}
 findById(id:string){return this.repo.findOne({where:{id} as FindOptionsWhere<T>});}
 findMany(o:FindOptions<T>={}){return this.repo.find({where:o.where as FindOptionsWhere<T>,take:o.take,skip:o.skip,order:o.orderBy?{[String(o.orderBy)]:o.direction??'ASC'} as never:undefined});}
 async create(input:C){return this.repo.save(this.repo.create(input as DeepPartial<T>));}
 async update(id:string,input:U){const entity=await this.findById(id);if(!entity)throw new Error('Record not found');return this.repo.save(this.repo.merge(entity,input as DeepPartial<T>));}
 async delete(id:string){return (await this.repo.delete(id)).affected!>0;}
}