import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff' },
  header: { marginBottom: 20, borderBottom: '2px solid #1976d2', paddingBottom: 10 },
  title: { fontSize: 24, color: '#060606', fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf', backgroundColor: '#f0f0f0' },
  tableCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bfbfbf' },
  
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' },
  tableCell: { margin: 5, fontSize: 10 },
  
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'grey' }
});

const PuertosPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <View style={styles.header}>
        <Text style={styles.title}>Listado de Puertos</Text>
        <Text style={styles.subtitle}>Informe de situación y capacidades</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Nombre</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Ciudad</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>País</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Capacidad (TEU)</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Estado</Text></View>
        </View>

        {data.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.nombre}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.ciudad}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.pais}</Text></View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                    {row.capacidad_teu ? row.capacidad_teu.toLocaleString() : 'N/D'}
                </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{row.activo ? 'Activo' : 'Inactivo'}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Página ${pageNumber} de ${totalPages}`
      )} fixed />
      
    </Page>
  </Document>
);

export default PuertosPDF;