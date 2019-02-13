import squel from 'squel'
const sq = squel.useFlavour('postgres')

export function select(table) {
    return sq
        .select()
        .field('id')
        .field('created_at')
        .field('updated_at')
        .field('author')
        .field('deleted')
        .field('title')
        .from(table)
        .where('NOT deleted')
}

export function insert (table, values) {
    return sq
        .insert()
        .into(table)
        .setFields(values)
}

export function edit(table, data, id) {
    return sq
        .update()
        .table(table)
        .where('id = ?', id)
}

export function editSetFields(table, data, id) {
    return sq
        .update()
        .table(table)
        .setFields(data)
        .where('id = ?', id)
}

export function softDelete(table, id) {
    return sq
        .update()
        .table(table)
        .set('deleted', true)
        .where('id = ?', id)
        .where('NOT deleted')
}

const proto = {
    select,
    insert,
    edit,
    editSetFields,
    softDelete
}

export default function () {
    return Object.assign({}, proto)
}