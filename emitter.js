'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscribers = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            signing(subscribers, event, context, handler, Infinity, 1);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let events = [];
            if (subscribers.hasOwnProperty(event)) {
                events.push(event);
            }
            if (events.length === 0) {
                return this;
            }
            for (let name of Object.keys(subscribers)) {
                if (name.startsWith(event)) {
                    events.push(name);
                }
            }
            for (let _event of events) {
                subscribers[_event].students = subscribers[_event].students
                    .filter(student => student.student !== context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let events = getEvents(event);
            for (let item of events) {
                if (!subscribers.hasOwnProperty(item)) {
                    continue;
                }
                subscribers[item].count += 1;
                subscribers[item].students.forEach((student) => {
                    let number = 1 +
                        Math.floor(subscribers[item].count / student.frequency) *
                            student.frequency;
                    if (student.count > 0 && (student.frequency === 1 ||
                        number === subscribers[item].count)) {
                        student.handler.call(student.student);
                        student.count -= 1;
                    }
                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            times = times <= 0 ? Infinity : times;
            signing(subscribers, event, context, handler, times, 1);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} _frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, _frequency) {
            _frequency = _frequency <= 0 ? 1 : _frequency;
            signing(subscribers, event, context, handler, Infinity, _frequency);

            return this;
        }
    };
}

function getEvents(event) {
    let events = [];
    let array = event.split('.');
    events.push(array[0]);
    for (let i = 1; i < array.length; i++) {
        events.push(events[events.length - 1] + '.' + array[i]);
    }

    return events.reverse();
}

function signing(...parameters) {
    let [subscribers, event, student, handler, count, frequency] = parameters;
    let obj = {
        'student': student,
        'handler': handler,
        'count': count,
        'frequency': frequency };
    if (subscribers.hasOwnProperty(event)) {
        subscribers[event].students.push(obj);
    } else {
        subscribers[event] = {
            'count': 0,
            students: [obj] };
    }
}
