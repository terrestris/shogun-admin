export default {
  de: {
    translation: {
      Index: {
        unauthorizedTitle: 'Sie sind nicht berechtigt, diese Seite zu öffnen.',
        errorTitle: 'Die Anwendung konnte nicht geladen werden. Prüfen Sie Ihre Konsole.',
        backToLoginButtonText: 'Zurück zum Login'
      },
      App: {
        loading: 'laden',
        loadFail: 'Die Daten konnten nicht geladen werden. Überprüfen Sie Ihre Konsole.'
      },
      FullscreenWrapper: {
        fullscreen: 'Vollbild',
        leaveFullscreen: 'Vollbild verlassen'
      },
      WelcomeDashboard: {
        applications: 'Applikationen',
        applicationInfo: '… die die Welt bewegen',
        applicationSingular: 'Applikation',
        applicationPlural: 'Applikationen',
        subject: 'Themen',
        subjectInfo: '… die die Welt bewegen',
        subjectSingluar: 'Thema',
        subjectPlural: 'Themen',
        user: 'Benutzer',
        userInfo: '… die die Welt verbessern',
        userSingular: 'Benutzer',
        userPlural: 'Benutzer'
      },
      DashboardStatistics: {
        statisticsTitle: 'Insgesamt verfügbar'
      },
      Navigation: {
        content: 'Inhalte',
        application: 'Applikationen',
        subject: 'Themen',
        user: 'Benutzer',
        group: 'Gruppen',
        status: 'Status',
        metrics: 'Metriken',
        logs: 'Logs',
        configuration: 'Einstellungen',
        global: 'Global',
        image: 'Bilddateien'
      },
      GeneralEntityRoot: {
        save: '{{entity}} speichern',
        reset: '{{entity}} zurücksetzen',
        create: '{{entity}} erstellen',
        upload: {
          success: {
            message: '{{entity}} erfolgreich erstellt',
            description: 'Datei {{fileName}} wurde erfolgreich geladen und der Layer {{layerName}} erstellt'
          },
          error: {
            message: 'Konnte {{entity}} nicht erstellen',
            description: 'Fehler beim Hochladen der Datei {{fileName}}',
            descriptionSize: 'Der Upload überschreitet das Limit von {{maxSize}} MB',
            descriptionFormat: 'Der Dateityp ist nicht unterstützt ({{supportedFormats}})',
          },
          button: '{{entity}} hochladen'
        },
        saveSuccess: '{{entity}} erfolgreich gespeichert',
        saveFail: 'Konnte {{entity}} nicht speichern'
      },
      GeneralEntityTable: {
        cancelText: 'Abbrechen',
        title: 'Entität löschen',
        contentInfo: 'Die Entität "{{entityName}}" wird gelöscht!',
        contentConfirmInfo: 'Bitte geben sie zum Bestätigen den Namen ein:',
        deleteConfirm: 'Löschen erfolgreich',
        deleteConfirmDescript: 'Die Entität "{{entityName}}" wurde gelöscht!',
        deleteFail: 'Löschen fehlgeschlagen',
        deleteFailDescript: 'Die Entität "{{entityName}}" konnte nicht gelöscht werden!',
        columnId: 'ID',
        columnName: 'Name',
        tooltipReload: 'Neu laden',
        tooltipDelete: 'Löschen'
      },
      ImageFileRoot: {
        title: 'Bilddateien',
        subTitle: '… die die Welt zeigen',
        button: 'Bilddatei hochladen',
        success: 'Upload erfolgreich',
        failure: 'Fehler beim Upload',
        uploadSuccess: 'Die Datei {{entityName}} wurde erfolgreich hochgeladen',
        uploadFailure: 'Die Datei {{entityName}} konnte nicht hochgeladen werden'
      },
      Logs: {
        logs: 'Logs',
        logsInfo: '… die die Welt erklären',
        refresh: 'Aktualisieren',
        reloadChecked: 'Automatisches Nachladen',
        reloadUnChecked: 'Kein Nachladen'
      },
      LinkField: {
        title: 'Öffne Link'
      },
      Metrics: {
        title: 'Metriken',
        info: '… die die Welt vermessen'
      },
      GlobalSettings: {
        global: 'Einstellungen',
        globalInfo: '… die die Welt lenken'
      },
      LogSettings: {
        logs: 'Einstellungen',
        logsInfo: '… die die Welt lenken',
        tableName: 'Name',
        tableLevel: 'Level'
      },
      EvictCache: {
        clear: 'Clear cache'
      },
      User: {
        settings: 'Profileinstellungen',
        info: 'Info',
        logout: 'Ausloggen'
      },
      Table: {
        filterTitle: 'Filtermenü',
        filterConfirm: 'OK',
        filterReset: 'Zurücksetzen',
        filterEmptyText: 'Keine Filter',
        filterCheckall: 'Alles auswählen',
        filterSearchPlaceholder: 'In Filtern suchen',
        emptyText: 'Keine Daten',
        selectAll: 'Diese Seite auswählen',
        selectInvert: 'Diese Seite invertieren',
        selectNone: 'Nichts auswählen',
        selectionAll: 'Alles auswählen',
        sortTitle: 'Sortieren',
        expand: 'Zeile ausklappen',
        collapse: 'Zeile einklappen',
        triggerDesc: 'Klicken, um absteigend zu sortieren',
        triggerAsc: 'Klicken, um aufsteigend zu sortieren',
        cancelSort: 'Klicken, um Sortierung zurückzusetzen'
      },
      YesorNoField: {
        yes: 'Ja',
        no: 'Nein'
      },
      UserPermissionGrid: {
        loadErrorMsg: 'Fehler beim Laden der Berechtigungen',
        updateErrorMsg: 'Fehler beim Aktualisieren der Berechtigung',
        deleteErrorMsg: 'Fehler beim Löschen der Berechtigung',
        filterInputPlaceholder: 'Suche…',
        filterSearchButtonText: 'Suche',
        filterResetButtonText: 'Zurücksetzen',
        userColumnTitle: 'Name',
        permissionColumnTitle: 'Berechtigung',
        deletePermissionButtonTooltip: 'Berechtigung löschen'
      },
      PermissionSelect: {
        placeholder: 'Berechtigung auswählen…',
        readLabel: 'Lesen',
        readUpdateLabel: 'Aktualisieren',
        readUpdateDeleteLabel: 'Aktualisieren & Löschen',
        adminLabel: 'Besitzer'
      },
      UserPermissionModal: {
        loadErrorMsg: 'Fehler beim Laden der Berechtigungen',
        saveErrorMsg: 'Fehler beim Speichern der Berechtigung für die Nutzer mit den IDs: {{userIds}}',
        openModalButtonTooltipTitle: 'Berechtigung hinzufügen',
        title: 'Berechtigung hinzufügen',
        description: 'Wählen Sie einen oder mehrere Nutzer sowie die zugehörige Berechtigung aus.',
        userSelectLabel: 'Nutzername oder Email Adresse',
        userSelectExtra: 'Wählen Sie die Nutzer aus der Liste aus oder geben Sie einen ' +
          'Suchbegriff (Nutzername oder Email Adresse) ein',
        userSelectPlaceholder: 'Nutzer auswählen…',
        permissionSelectLabel: 'Berechtigung',
        permissionSelectExtra: 'Wählen Sie die Berechtigung aus, die die Nutzer erhalten sollen.'
      },
      ApplicationInfoModal: {
        clientVersion: 'Admin-Version',
        backendVersion: 'SHOGun-Version',
        buildTime: 'Build Zeit',
        title: 'SHOGun-Admin Information'
      },
      LayerPreview: {
        title: 'Layervorschau ({{layerName}})',
        tooltipTitle: 'Layervorschau öffnen',
        extentErrorMsg: 'Fehler beim Zoomen auf die Gesamtansicht des Layers.',
        addLayerErrorMsg: 'Fehler beim Hinzufügen des Layers zur Karte.',
        loadLayerErrorMsg: 'Fehler beim Laden des Layers.',
        extentNotSupportedErrorMsg: 'Zoomen auf Gesamtansicht wird für diesen Typ nicht unterstützt.'
      }
    }
  },
  en: {
    translation: {
      Index: {
        unauthorizedTitle: 'You\'re not authorized to access this page.',
        errorTitle: 'Failed to load the application. Check your console.',
        backToLoginButtonText: 'Back to login'
      },
      App: {
        loading: 'loading',
        loadFail: 'Failed to load the initial data. Check your console.'
      },
      FullscreenWrapper: {
        fullscreen: 'Fullscreen',
        leaveFullscreen: 'Leave fullscreen'
      },
      WelcomeDashboard: {
        applications: 'Applications',
        applicationInfo: '… that move the world',
        applicationSingular: 'Application',
        applicationPlural: 'Applications',
        subject: 'Subjects',
        subjectInfo: '… that move the world',
        subjectSingluar: 'Subject',
        subjectPlural: 'Subjects',
        user: 'User',
        userInfo: '… that improve the world',
        userSingular: 'User',
        userPlural: 'Users'
      },
      DashboardStatistics: {
        statisticsTitle: 'Total available'
      },
      Navigation: {
        content: 'Content',
        application: 'Application',
        subject: 'Subject',
        user: 'User',
        group: 'Group',
        status: 'Status',
        metrics: 'Metrics',
        logs: 'Logs',
        configuration: 'Configuration',
        global: 'Global',
        image: 'Images'
      },
      GeneralEntityRoot: {
        save: 'Save {{entity}}',
        reset: 'Reset {{entity}}',
        create: 'Create {{entity}}',
        upload: {
          success: {
            message: '{{entity}} successfully created',
            description: 'Successfully uploaded file {{fileName}} and created layer {{layerName}}'
          },
          error: {
            message: 'Could not create {{entity}}',
            description: 'Error while uploading file {{fileName}}',
            descriptionSize: 'The file exceeds the upload limit of {{maxSize}} MB',
            descriptionFormat: 'The given file type does not match the supported ones ({{supportedFormats}})',
          },
          button: 'Upload {{entity}}'
        },
        saveSuccess: '{{entity}} successfully saved',
        saveFail: 'Could not save {{entity}}'
      },
      GeneralEntityTable: {
        cancelText: 'Cancel',
        title: 'Delete entity',
        contentInfo: 'The entity "{{entityName}}" will be deleted!',
        contentConfirmInfo: 'Please enter the name to confirm:',
        deleteConfirm: 'Delete successful',
        deleteConfirmDescript: 'The entity "{{entityName}}" was deleted',
        deleteFail: 'Deletion failed',
        deleteFailDescript: 'The entity "{{entityName}}" could not be deleted!',
        columnId: 'ID',
        columnName: 'Name',
        tooltipReload: 'Reload',
        tooltipDelete: 'Delete'
      },
      ImageFileRoot: {
        title: 'Images',
        subTitle: '… that show the world',
        button: 'Upload image',
        success: 'Upload successful',
        failure: 'Error during upload',
        uploadSuccess: 'The {{entityName}} file was successfully uploaded',
        uploadFailure: 'The file {{entityName}} could not be uploaded'
      },
      Logs: {
        metric: 'Metrics',
        metricsInfo: '… that measure the world',
        logs: 'Logs',
        logsInfo: '… that explain the world',
        refresh: 'Refresh',
        reloadChecked: 'Live reload',
        reloadUnChecked: 'No reload'
      },
      LinkField: {
        title: 'Open link'
      },
      Metrics: {
        title: 'Metrics',
        info: '… that measure the world'
      },
      GlobalSettings: {
        global: 'Configuration',
        globalInfo: '… that guide the world'
      },
      LogSettings: {
        logs: 'Configuration',
        logsInfo: '… that guide the world',
        tableName: 'Name',
        tableLevel: 'Level'
      },
      EvictCache: {
        clear: 'Clear cache'
      },
      User: {
        settings: 'Profile settings',
        info: 'Info',
        logout: 'Logout'
      },
      Table: {
        filterTitle: 'Filter menu',
        filterConfirm: 'OK',
        filterReset: 'Reset',
        filterEmptyText: 'No filters',
        filterCheckall: 'Select all items',
        filterSearchPlaceholder: 'Search in filters',
        emptyText: 'No data',
        selectAll: 'Select current page',
        selectInvert: 'Invert current page',
        selectNone: 'Clear all data',
        selectionAll: 'Select all data',
        sortTitle: 'Sort',
        expand: 'Expand row',
        collapse: 'Collapse row',
        triggerDesc: 'Click to sort descending',
        triggerAsc: 'Click to sort ascending',
        cancelSort: 'Click to cancel sorting'
      },
      YesorNoField: {
        yes: 'Yes',
        no: 'No'
      },
      ImageFileTable : {
        imageSingular: 'Image',
        imagePlural: 'Images',
        delete: 'Delete {{entity}}',
        cancel: 'Cancel',
        confirmInfo: 'The {{entity}} will be deleted!',
        conFirmTooltip: 'Do you really want to delete the {{entity}} file?',
        deletionInfo: '{{entity}} has been deleted',
        deletionDescription: '{{entity}} "{{record}}" has been deleted',
        deleteFail: 'Deletion failed',
        deleteFailDescript: 'The file "{{record}}" could not be deleted!',
        reloadTooltip: 'Reload'
      },
      UserPermissionGrid: {
        loadErrorMsg: 'Error while loading the permissions',
        updateErrorMsg: 'Error while updating the permission',
        deleteErrorMsg: 'Error while deleting the permission',
        filterInputPlaceholder: 'Search…',
        filterSearchButtonText: 'Search',
        filterResetButtonText: 'Reset',
        userColumnTitle: 'Name',
        permissionColumnTitle: 'Permission',
        deletePermissionButtonTooltip: 'Delete permission'
      },
      PermissionSelect: {
        placeholder: 'Select a permission…',
        readLabel: 'Read',
        readUpdateLabel: 'Update',
        readUpdateDeleteLabel: 'Update & Delete',
        adminLabel: 'Owner'
      },
      UserPermissionModal: {
        loadErrorMsg: 'Error while loading the permissions',
        saveErrorMsg: 'Error while setting the permission for users with IDs: {{userIds}}',
        openModalButtonTooltipTitle: 'Add permission',
        title: 'Add permission',
        description: 'Select one or more users and the respective permission.',
        userSelectLabel: 'Username or email address',
        userSelectExtra: 'Select users from the list or search via username or email address.',
        userSelectPlaceholder: 'Select user(s)…',
        permissionSelectLabel: 'Permission',
        permissionSelectExtra: 'Select the permission the users should be granted.'
      },
      ApplicationInfoModal: {
        clientVersion: 'Admin version',
        backendVersion: 'SHOGun version',
        buildTime: 'Build time',
        title: 'SHOGun Admin info'
      },
      LayerPreview: {
        title: 'Layer preview ({{layerName}})',
        tooltipTitle: 'Open layer preview',
        extentErrorMsg: 'Could not zoom to the extent of the layer.',
        addLayerErrorMsg: 'Could not add the layer to the map.',
        loadLayerErrorMsg: 'Error while loading the layer.',
        extentNotSupportedErrorMsg: 'Zoom to layer is not supported for this type.'
      }
    }
  }
};
