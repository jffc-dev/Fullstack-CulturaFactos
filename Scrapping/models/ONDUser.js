import pckMongo from 'mongodb'
const { ObjectId } = pckMongo

export const ONDUser = class {
    constructor ({Username, Passsword, Fullname, CreationUser, CreationDate, ModificationUser, ModificationDate}) {
      this.Username = Username
      this.Passsword = Passsword
      this.Fullname = Fullname
      this.CreationUser = CreationUser
      this.CreationDate = CreationDate
      this.ModificationUser = ModificationUser
      this.ModificationDate = ModificationDate
    }

    modelToOND (model){
        this.Id = new ObjectId(model._id)
        this.Username = model.Username
        this.Passsword = model.Passsword
        this.Fullname = model.Fullname
        this.CreationUser = model.CreationUser
        this.CreationDate = model.CreationDate
        this.ModificationUser = model.ModificationUser
        this.ModificationDate = model.ModificationDate
    }

    toModel (){
        return {
            Username: this.Username
            ,Passsword: this.Passsword
            ,Fullname: this.Fullname
            ,CreationUser: this.CreationUser
            ,CreationDate: this.CreationDate
            ,ModificationUser: this.ModificationUser
            ,ModificationDate: this.ModificationDate
        }
    }

    toOND (){
        return {
            Id: this.Id
            ,Username: this.Username
            ,Passsword: this.Passsword
            ,Fullname: this.Fullname
            ,CreationUser: this.CreationUser
            ,CreationDate: this.CreationDate
            ,ModificationUser: this.ModificationUser
            ,ModificationDate: this.ModificationDate
        }
    }
}
