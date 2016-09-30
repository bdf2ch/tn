/******************************
 * States
 * Набор свойст и методов, описывающих состояние объекта
 ******************************/

$classesInjector.add("States", {
    __dependencies__: [],
    _states_: {
        isActive: false,        // Флаг, сигнализирующий, активен ли объект
        isSelected: false,      // Флаг, сигнализирующий, выбран ли объект
        isChanged: false,       // Флаг, сигнализирующий, был ли изменен объект
        isLoaded: true,         // Флаг, сигнализирующий был ли объект загружен
        isLoading: false,       // Флаг, сигнализирующий, находится ли объект в режиме загрузки
        isInEditMode: false,    // Флаг, сигнализирующий, находится ли объект в режиме редактирования
        isInDeleteMode: false,  // Флаг, сигнализирующий, находится ли объект в режиме удаления

        /**
         * Устанавливает / отменяет режим активного объекта
         * @param flag {Boolean} - Флаг активности / неактивности объекта
         * @returns {boolean} - Возвращает флаг активности / неактивности объекта
         */
        active: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isActive = flag;
            return this.isActive;
        },

        /**
         * Устанавливает / отменяет режим редактирования объекта
         * @param flag {Boolean} - Флаг нахождения объекта в режиме редактирования
         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме редактирования
         */
        editing: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isInEditMode = flag;
            return this.isInEditMode;
        },

        /**
         * Устанавливает / отменяет режим удаления объекта
         * @param flag {boolean} - Флаг нахождения объекта в режиме удаления
         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме удаления
         */
        deleting: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isInDeleteMode = flag;
            return this.isInDeleteMode;
        },

        /**
         * Устанавливает / отменяет режим измененного объекта
         * @param flag {boolean} - Флаг, был ли объект изменен
         * @returns {boolean} - Возвращает флаг, был ли объект изменен
         */
        changed: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isChanged = flag;
            return this.isChanged;
        },

        /**
         * Устанавливает / отменяет режим выбранного объекта
         * @param flag {boolean} - Флаг, был ли выбран объект
         * @returns {boolean} - Возвращает флаг, был ли выбран объект
         */
        selected: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isSelected = flag;
                //console.log("selected = ", this.isSelected);
            }
            return this.isSelected;
        },

        /**
         * Устанавливает / отменяет режим загруженного объекта
         * @param flag {boolean} - Флаг, был ли объект загружен
         * @returns {boolean} - Возвращает флаг, был ли объект загружен
         */
        loaded: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isLoaded = flag;
            return this.isLoaded;
        },

        /**
         * Устанавливает / отменяет режим загруженного объекта
         * @param flag {boolean} - Флаг, был ли объект загружен
         * @returns {boolean} - Возвращает флаг, был ли объект загружен
         */
        loading: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean)
                this.isLoading = flag;
            return this.isLoading;
        }
    }
});