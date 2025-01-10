import ISetting from 'src/models/setting/setting.interface'
import Repository from '../repository'
class SettingRepository extends Repository<ISetting> {
  constructor() {
    super('v2/settings')
  }
}
export default SettingRepository
