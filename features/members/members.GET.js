const { knex } = require("../../db/db");

const activeStatuts = [1, 2, 3, 4];// President, Treasurer, Secrétaire, Membre actif
module.exports = async (r, h) => {


  const { email } = r.query;
  try {
    if (email) {
      const member = await knex('galette_adherents')
        .join('galette_statuts', 'galette_adherents.id_statut', 'galette_statuts.id_statut')
        .whereIn('galette_adherents.id_statut', activeStatuts)
        .where('galette_adherents.email_adh', email)
        .select('galette_adherents.*', 'galette_statuts.libelle_statut as statut_nom')
        .first();
      return h.response(member);
    }
    const members = await knex('galette_adherents')
      .join('galette_statuts', 'galette_adherents.id_statut', 'galette_statuts.id_statut')
      .whereIn('galette_adherents.id_statut', activeStatuts)
      .where(function () {
        this.where('galette_adherents.date_echeance', '>', new Date())
          .orWhere('galette_adherents.bool_exempt_adh', true);
      })
      .select('galette_adherents.*', 'galette_statuts.libelle_statut as statut_nom')
      .orderBy('galette_adherents.date_echeance', 'asc');
    return h.response(members);
  } catch (error) {
    return h.response({ error }).code(500);
  }
}