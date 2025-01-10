import { AdminLogEvent, AdminLogScreen } from 'src/utils/status'

import { RootStore } from 'src/stores/root'
import axios from 'axios'

export class AdminLogManager {
  private static userId: string = ''
  private static role: string = ''
  private static userName: string = ''
  private static instance: AdminLogManager | null = null

  constructor(userId: string, role: string, userName: string) {
    AdminLogManager.userId = userId
    AdminLogManager.role = role
    AdminLogManager.userName = userName
  }

  public static createInstance(userId: string, role: string, userName: string) {
    if (this.instance === null) {
      console.info('adminLogManager created')
      this.instance = new AdminLogManager(userId, role, userName)
    }
    return this.instance
  }

  public static getInstance() {
    return this.instance
  }

  public static setModifier(userId: string, role: string, userName: string) {
    this.userId = userId
    this.role = role
    this.userName = userName
  }

  async createExportLog(props: CreateExportLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Export,
    })
  }
  async createEditLog(props: CreateEditLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Edit,
    })
  }
  async createAddLog(props: CreateAddLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Add,
    })
  }
  async createDeleteLog(props: CreateAddLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Delete,
    })
  }
  async createActivateLog(props: CreateAddLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Activate,
    })
    console.log("createActivateLog: ", props)
  } 
  async createDeactivateLog(props: CreateAddLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Deactivate,
    })
  }   
  async createAssignSimulationLog(props: CreateReopenLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.AssignSimulation,
    })
  }
  async createRemoveSimulationLog(props: CreateReopenLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.RemoveSimulation,
    })
  }
  async createReopenSimulationLog(props: CreateReopenLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ReopenSimulation,
    })
  }
  async createReallocateSimulationLog(props: CreateReallocateLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ReAllocateSimulation,
    })
  }
  async createVerifyLog(props: CreateVerifyLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Verify,
    })
  }
  async createSignOffLog(props: CreateSignOffLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.SignOff,
    })
  }
  async createInvoiceLog(props: CreateInvoiceLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Invoice,
    })
  }
  async createPermissionLog(props: CreatePermissionLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Permission,
    })
  }
  async createScoringSettingLog(props: CreateScoringSettingLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ScoringSetting,
    })
  }
  async createPublishSimulationLog(props: CreatePublishLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.PublishSimulation,
    })
  }
  async createExpediteSimulationLog(props: CreateExpediteLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ExpediteSimulation,
    })
  }
  async createScorerLog(props: CreateScorerLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Scorer,
    })
  }
  async createScorerStatusLog(props: CreateScorerStatusLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ScorerStatus,
    })
  }
  async createRetractSimulationLog(props: CreateRetractLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.RetractSimulation,
    })
  }
  async createScoringLog(props: CreateScoringLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Scoring,
    })
  }
  async createAdjudicatingLog(props: CreateAdjudicatingLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Adjudicating,
    })
  }
  async createDistributeSimulationLog(props: CreateDistributeLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.DistributeSimulation,
    })
  }
  async createResourceLog(props: CreateResourceLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Resource,
    })
  }
  async createImportFindingLog(props: CreateImportFindingLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.ImportFindings,
    })
  }
  async createMigrationVersionLog(props: CreateMigrationVersionLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.MigrationDemoVersion,
    })
  }
  async createMigrationLog(props: CreateMigrationLogLogDtoProps) {
    if (!AdminLogManager.userId || !AdminLogManager.role) {
      return console.error('Please set modifier')
    }
    await axios.post('v2/adminLogs', {
      ...props,
      userId: AdminLogManager.userId,
      role: AdminLogManager.role,
      userName: AdminLogManager.userName,
      event: AdminLogEvent.Migration,
    })
  }
}

type CreateExportLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateEditLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateAddLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateReopenLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateReallocateLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateVerifyLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateSignOffLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateInvoiceLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreatePermissionLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateScoringSettingLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreatePublishLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateExpediteLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateScorerLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateScorerStatusLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateRetractLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateScoringLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateAdjudicatingLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateDistributeLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateResourceLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateImportFindingLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateMigrationVersionLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}
type CreateMigrationLogLogDtoProps = {
  screen: AdminLogScreen
  target?: TargetObject
  resource?: Resource
  message?: string
}

type TargetObject = {
  type: AdminLogTargetType | string
  [key: string]: string
}

class Resource {
  [key: string]: any
}

export enum AdminLogTargetType {
  DataDump = 'DataDump',
  ClientUnit = 'ClientUnit',
  PDFFiles = 'PDFFiles',
  SimResources = 'SimResources',
}
