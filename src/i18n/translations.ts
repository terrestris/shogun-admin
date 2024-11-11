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
        fullscreen: 'Vergrößern',
        leaveFullscreen: 'Verkleinern'
      },
      WelcomeDashboard: {
        applications: 'Applikationen',
        applicationInfo: '… die die Welt bewegen',
        applicationSingular: 'Applikation',
        applicationPlural: 'Applikationen',
        layer: 'Layer',
        layerInfo: '… die die Welt bewegen',
        layerSingluar: 'Layer',
        layerPlural: 'Layer',
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
        layer: 'Layer',
        user: 'Benutzer',
        group: 'Gruppen',
        status: 'Status',
        metrics: 'Metriken',
        logs: 'Logs',
        logLevels: 'Logging-Level',
        configuration: 'Einstellungen',
        global: 'Global',
        image: 'Bilddateien'
      },
      GeneralEntityRoot: {
        save: '{{entity}} speichern',
        reset: '{{entity}} zurücksetzen',
        create: '{{entity}} erstellen',
        reminderModal: {
          title: 'Änderungen speichern?',
          description: 'Die Änderungen wurden noch nicht gespeichert, möchten Sie speichern?',
          accept: 'Speichern',
          review: 'Änderungen zeigen',
          decline: 'Verwerfen'
        },
        saveSuccess: '{{entity}} erfolgreich gespeichert',
        saveWarning: '{{entity}} wurde nicht gespeichert',
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
        tooltipDelete: 'Löschen',
        popupSearch: 'Suche',
        popupFilter: 'Filtern',
        popupReset: 'Zurücksetzen',
        paging: {
          nextPage: 'Nächste Seite',
          prevPage: 'Vorherige Seite',
          itemsPerPage: 'Seite',
          jumpTo: 'Springe zu',
          page: 'Seite',
          total: 'Total'
        }
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
      ImageFileForm: {
        title: 'Bilddatei',
        name: 'Dateiname',
        uuid: 'UUID',
        public: 'Öffentlich',
        preview: 'Vorschau'
      },
      Logs: {
        logs: 'Logs',
        logsInfo: '… die die Welt erklären',
        refresh: 'Aktualisieren',
        autoReload: 'Automatisches Nachladen',
        warningMessage: 'Logs können nicht angezeigt werden',
        warningDescribtion: 'Hinweis: Um die Logs anzeigen zu können ist es notwendig, dass die ' +
          'Logs in eine Datei geschrieben werden. Bitte die SHOGun API Konfiguration entsprechend überprüfen.'
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
        tableLevel: 'Level',
        searchPlaceholder: 'Suchen…'
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
      InstancePermissionGrid: {
        loadErrorMsg: 'Fehler beim Laden der Berechtigungen',
        updateErrorMsg: 'Fehler beim Aktualisieren der Berechtigung',
        deleteErrorMsg: 'Fehler beim Löschen der Berechtigung',
        filterInputPlaceholder: 'Suche…',
        filterSearchButtonText: 'Suche',
        filterResetButtonText: 'Zurücksetzen',
        nameColumnTitle: 'Name',
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
      PermissionModal: {
        loadErrorMsg: 'Fehler beim Laden der Berechtigungen',
        openModalButtonTooltipTitle: 'Berechtigung hinzufügen',
        title: 'Berechtigung hinzufügen',
        paginationTotal: 'Total',
        paginationNextPage: 'Nächste Seite',
        paginationPrevPage: 'Vorherige Seite'
      },
      GroupPermissionGrid: {
        modal: {
          description: 'Wählen Sie eine oder mehrere Gruppen sowie die zugehörige Berechtigung aus.',
          referenceSelectLabel: 'Gruppenname',
          referenceSelectExtra: 'Wählen Sie die Gruppe aus der Liste aus oder geben Sie einen ' +
            'Suchbegriff (Gruppenname) ein',
          referenceSelectPlaceholder: 'Gruppe auswählen…',
          permissionSelectLabel: 'Berechtigung',
          permissionSelectExtra: 'Wählen Sie die Berechtigung aus, die die Gruppe erhalten sollen.',
          saveErrorMsg: 'Fehler beim Speichern der Berechtigung für die Gruppen mit den IDs: {{referenceIds}}'
        }
      },
      UserPermissionGrid: {
        modal: {
          description: 'Wählen Sie einen oder mehrere Nutzer sowie die zugehörige Berechtigung aus.',
          referenceSelectLabel: 'Nutzername oder Email Adresse',
          referenceSelectExtra: 'Wählen Sie die Nutzer aus der Liste aus oder geben Sie einen ' +
            'Suchbegriff (Gruppenname oder Email Adresse) ein',
          referenceSelectPlaceholder: 'Nutzer auswählen…',
          permissionSelectLabel: 'Berechtigung',
          permissionSelectExtra: 'Wählen Sie die Berechtigung aus, die die Nutzer erhalten sollen.',
          saveErrorMsg: 'Fehler beim Speichern der Berechtigung für die Nutzer mit den IDs: {{referenceIds}}'
        }
      },
      RolePermissionGrid: {
        modal: {
          description: 'Wählen Sie einen oder mehrere Rolle sowie die zugehörige Berechtigung aus.',
          referenceSelectLabel: 'Rollenname',
          referenceSelectExtra: 'Wählen Sie die Rolle aus der Liste aus oder geben Sie einen ' +
            'Suchbegriff (Rollenname) ein',
          referenceSelectPlaceholder: 'Rolle auswählen…',
          permissionSelectLabel: 'Berechtigung',
          permissionSelectExtra: 'Wählen Sie die Berechtigung aus, die die Rolle erhalten sollen.',
          saveErrorMsg: 'Fehler beim Speichern der Berechtigung für die Rollen mit den IDs: {{referenceIds}}'
        }
      },
      ApplicationInfoModal: {
        clientAbout: 'Über',
        clientVersion: 'Admin Version',
        backendVersion: 'Backend Version',
        buildTime: 'Build Zeit',
        applicationInfo: 'Die Standardanwendung',
        title: 'SHOGun-Admin Information'
      },
      LayerPreview: {
        title: 'Layervorschau ({{layerName}})',
        tooltipTitle: 'Layervorschau öffnen',
        extentErrorMsg: 'Fehler beim Zoomen auf die Gesamtansicht des Layers.',
        addLayerErrorMsg: 'Fehler beim Hinzufügen des Layers zur Karte.',
        loadLayerErrorMsg: 'Fehler beim Laden des Layers.',
        extentNotSupportedErrorMsg: 'Zoomen auf Gesamtansicht wird für diesen Typ nicht unterstützt.'
      },
      VerifyProviderDetailsField: {
        title: 'Keine Informationen des Authentication-Providers verfügbar'
      },
      UploadLayerButton: {
        success: {
          message: 'Layer erfolgreich erstellt',
          description: 'Datei {{fileName}} wurde erfolgreich geladen und der Layer {{layerName}} erstellt'
        },
        error: {
          message: 'Konnte Layer nicht erstellen',
          description: 'Fehler beim Hochladen der Datei {{fileName}}',
          descriptionSize: 'Der Upload überschreitet das Limit von {{maxSize}} MB',
          descriptionFormat: 'Der Dateityp ist nicht unterstützt ({{supportedFormats}})',
          descriptionZipContent: 'Mehrere Geodatensätze innerhalb eines Archivs sind nicht unterstützt'
        },
        title: 'Layer erstellen'
      },
      CreateAllUsersButton: {
        title: 'Nutzer synchronisieren',
        tooltip: 'Add all missing users from the user provider',
        success: 'Nutzer erfolgreich erstellt',
        error: 'Fehler beim Erstellen der Nutzer'
      },
      CreateAllGroupsButton: {
        title: 'Gruppen synchronisieren',
        tooltip: 'Add all missing users from the user provider',
        success: 'Gruppen erfolgreich erstellt',
        error: 'Fehler beim Erstellen der Gruppen'
      },
      CreateAllRolesButton: {
        title: 'Rollen synchronisieren',
        tooltip: 'Add all missing users from the user provider',
        success: 'Rollen erfolgreich erstellt',
        error: 'Fehler beim Erstellen der Rollen'
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
        fullscreen: 'Maximize',
        leaveFullscreen: 'Minimize'
      },
      WelcomeDashboard: {
        applications: 'Applications',
        applicationInfo: '… that move the world',
        applicationSingular: 'Application',
        applicationPlural: 'Applications',
        layer: 'Layers',
        layerInfo: '… that move the world',
        layerSingluar: 'Layer',
        layerPlural: 'Layers',
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
        layer: 'Layer',
        user: 'User',
        group: 'Group',
        status: 'Status',
        metrics: 'Metrics',
        logs: 'Logs',
        logLevels: 'Logging levels',
        configuration: 'Configuration',
        global: 'Global',
        image: 'Images'
      },
      GeneralEntityRoot: {
        save: 'Save {{entity}}',
        reset: 'Reset {{entity}}',
        create: 'Create {{entity}}',
        reminderModal: {
          title: 'Save changes?',
          description: 'The changes have not yet been saved, do you want to save?',
          accept: 'Save',
          review: 'review changes',
          decline: 'Discard'
        },
        saveSuccess: '{{entity}} successfully saved',
        saveWarning: '{{entity}} has not been saved',
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
        tooltipDelete: 'Delete',
        popupSearch: 'Search',
        popupFilter: 'Filter',
        popupReset: 'Reset',
        paging: {
          nextPage: 'Next page',
          prevPage: 'Previous page',
          itemsPerPage: 'page',
          jumpTo: 'Go to',
          page: 'Page',
          total: 'Total'
        }
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
      ImageFileForm: {
        title: 'Image',
        name: 'Filename',
        uuid: 'UUID',
        public: 'Public',
        preview: 'Preview'
      },
      Logs: {
        metric: 'Metrics',
        metricsInfo: '… that measure the world',
        logs: 'Logs',
        logsInfo: '… that explain the world',
        refresh: 'Refresh',
        autoReload: 'Hot reload',
        warningMessage: 'Error while displaying the logs',
        warningDescribtion: 'Note: In order to be able to display the logs, it is necessary that the logs ' +
          'are written to a file. Please check the SHOGun API configuration accordingly.'
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
        tableLevel: 'Level',
        searchPlaceholder: 'Search by…'
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

      InstancePermissionGrid: {
        loadErrorMsg: 'Error while loading the permissions',
        updateErrorMsg: 'Error while updating the permission',
        deleteErrorMsg: 'Error while deleting the permission',
        filterInputPlaceholder: 'Search…',
        filterSearchButtonText: 'Search',
        filterResetButtonText: 'Reset',
        nameColumnTitle: 'Name',
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
      PermissionModal: {
        loadErrorMsg: 'Error while loading the permissions',
        openModalButtonTooltipTitle: 'Add permission',
        title: 'Add permission',
        paginationTotal: 'Total',
        paginationNextPage: 'Next page',
        paginationPrevPage: 'Previous page'
      },
      GroupPermissionGrid: {
        modal: {
          description: 'Select one or more groups and the respective permission.',
          referenceSelectLabel: 'Group name',
          referenceSelectExtra: 'Select groups from the list or search via name.',
          referenceSelectPlaceholder: 'Select groups(s)…',
          permissionSelectLabel: 'Permission',
          permissionSelectExtra: 'Select the permission the groups should be granted.',
          saveErrorMsg: 'Error while setting the permission for groups with IDs: {{referenceIds}}'
        }
      },
      UserPermissionGrid: {
        modal: {
          description: 'Select one or more users and the respective permission.',
          referenceSelectLabel: 'Username or email address',
          referenceSelectExtra: 'Select users from the list or search via username or email address.',
          referenceSelectPlaceholder: 'Select user(s)…',
          permissionSelectLabel: 'Permission',
          permissionSelectExtra: 'Select the permission the users should be granted.',
          saveErrorMsg: 'Error while setting the permission for users with IDs: {{referenceIds}}'
        }
      },
      RolePermissionGrid: {
        modal: {
          description: 'Select one or more roles and the respective permission.',
          referenceSelectLabel: 'Role name',
          referenceSelectExtra: 'Select roles from the list or search via role name.',
          referenceSelectPlaceholder: 'Select role(s)…',
          permissionSelectLabel: 'Permission',
          permissionSelectExtra: 'Select the permission the roles should be granted.',
          saveErrorMsg: 'Error while setting the permission for roles with IDs: {{referenceIds}}'
        }
      },
      ApplicationInfoModal: {
        clientAbout: 'About',
        clientVersion: 'Admin version',
        backendVersion: 'Backend version',
        buildTime: 'Build time',
        applicationInfo: 'The default application',
        title: 'SHOGun Admin info'
      },
      LayerPreview: {
        title: 'Layer preview ({{layerName}})',
        tooltipTitle: 'Open layer preview',
        extentErrorMsg: 'Could not zoom to the extent of the layer.',
        addLayerErrorMsg: 'Could not add the layer to the map.',
        loadLayerErrorMsg: 'Error while loading the layer.',
        extentNotSupportedErrorMsg: 'Zoom to layer is not supported for this type.'
      },
      VerifyProviderDetailsField: {
        title: 'No authentication provider information available'
      },
      UploadLayerButton: {
        success: {
          message: 'Layer successfully created',
          description: 'Successfully uploaded file {{fileName}} and created layer {{layerName}}'
        },
        error: {
          message: 'Could not create layer',
          description: 'Error while uploading file {{fileName}}',
          descriptionSize: 'The file exceeds the upload limit of {{maxSize}} MB',
          descriptionFormat: 'The given file type does not match the supported ones ({{supportedFormats}})',
          descriptionZipContent: 'Multiple geodatasets within one archive are not supported'
        },
        title: 'Create layer'
      },
      CreateAllUsersButton: {
        title: 'Add users',
        tooltip: 'Add all missing users from the user provider',
        success: 'Successfully created all users',
        error: 'Could not create the users'
      },
      CreateAllGroupsButton: {
        title: 'Add groups',
        tooltip: 'Add all missing groups from the group provider',
        success: 'Successfully created all groups',
        error: 'Could not create the groups'
      },
      CreateAllRolesButton: {
        title: 'Add roles',
        tooltip: 'Add all missing roles from the role provider',
        success: 'Successfully created all roles',
        error: 'Could not create the roles'
      }
    }
  }
};
